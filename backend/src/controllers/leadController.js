import { LeadModel } from '../models/leadModel.js'
import { UserModel } from '../models/userModel.js'
import { parseExcelBuffer } from '../utils/parseExcel.js'
import { diffChanges, recordAudit } from '../utils/auditLog.js'
import { recordExcelUpload } from '../utils/excelUploadLog.js'
import { buildExportFileName, buildLeadExcelBuffer, buildLeadPdfBuffer } from '../utils/exportLeads.js'

const LEAD_FIELDS = [
  'name',
  'email',
  'phone',
  'company',
  'role',
  'status',
  'followUpDate',
  'rejectionReason',
]

const MOBILE_LEAD_FIELDS = ['status', 'followUpDate', 'rejectionReason']

export const LeadController = {
  async list(req, res) {
    const { userId } = req.query
    res.json(await LeadModel.findAll(userId))
  },

  async exportExcel(req, res) {
    const userId = req.query.userId?.trim()

    if (!userId) {
      return res.status(400).json({ message: 'Select a user to export leads for.' })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const leads = await LeadModel.findByUser(userId)
    const buffer = buildLeadExcelBuffer(leads)
    const fileName = buildExportFileName(user.name, 'xlsx')

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.send(buffer)
  },

  async exportPdf(req, res) {
    const userId = req.query.userId?.trim()

    if (!userId) {
      return res.status(400).json({ message: 'Select a user to export leads for.' })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const leads = await LeadModel.findByUser(userId)
    const buffer = await buildLeadPdfBuffer(leads, user.name)
    const fileName = buildExportFileName(user.name, 'pdf')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.send(buffer)
  },

  async update(req, res) {
    const before = await LeadModel.findById(req.params.id)

    if (!before) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    const lead = await LeadModel.update(req.params.id, req.body)

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    const enriched = await LeadModel.enrich(lead)

    await recordAudit(req, {
      action: 'update',
      entityType: 'lead',
      entityId: enriched.id,
      entityLabel: enriched.name,
      summary: `Updated lead ${enriched.name}`,
      changes: diffChanges(before, lead, LEAD_FIELDS),
    })

    res.json(enriched)
  },

  async remove(req, res) {
    const before = await LeadModel.findById(req.params.id)

    if (!before) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    const deleted = await LeadModel.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    await recordAudit(req, {
      action: 'delete',
      entityType: 'lead',
      entityId: before.id,
      entityLabel: before.name,
      summary: `Deleted lead ${before.name}`,
      changes: [{ field: 'deleted', from: before.name, to: null }],
    })

    res.json({ success: true })
  },

  async importForUser(req, res) {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required.' })
    }

    const userId = req.body.userId?.trim()

    if (!userId) {
      return res.status(400).json({ message: 'Select a user to import leads for.' })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    try {
      const parsedLeads = parseExcelBuffer(req.file.buffer)
      const importedLeads = await LeadModel.importForUser(userId, parsedLeads)

      await recordAudit(req, {
        action: 'import',
        entityType: 'lead',
        entityId: userId,
        entityLabel: user.name,
        summary: `Imported ${importedLeads.length} lead(s) for ${user.name}`,
        changes: [{ field: 'leadCount', from: null, to: importedLeads.length }],
      })

      await recordExcelUpload(req, {
        user,
        fileName: req.file.originalname,
        leadCount: importedLeads.length,
        source: 'admin',
      })

      res.json({
        count: importedLeads.length,
        userId,
        userName: user.name,
        fileName: req.file.originalname,
        leads: await Promise.all(importedLeads.map((lead) => LeadModel.enrich(lead))),
      })
    } catch (error) {
      res.status(400).json({ message: error.message || 'Failed to import Excel file.' })
    }
  },

  async listMine(req, res) {
    res.json(await LeadModel.findByUser(req.userId))
  },

  async updateMine(req, res) {
    const before = await LeadModel.findById(req.params.id)

    if (!before || before.userId !== req.userId) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    const lead = await LeadModel.updateForUser(req.params.id, req.userId, req.body)

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    await recordAudit(req, {
      action: 'update',
      entityType: 'lead',
      entityId: lead.id,
      entityLabel: lead.name,
      summary: `Updated lead ${lead.name}`,
      changes: diffChanges(before, lead, MOBILE_LEAD_FIELDS),
    })

    res.json(lead)
  },

  async importMine(req, res) {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required.' })
    }

    try {
      const parsedLeads = parseExcelBuffer(req.file.buffer)
      const importedLeads = await LeadModel.importForUser(req.userId, parsedLeads)

      await recordAudit(req, {
        action: 'import',
        entityType: 'lead',
        entityId: req.userId,
        entityLabel: req.user?.name || 'Mobile user',
        summary: `Imported ${importedLeads.length} lead(s) from mobile app`,
        changes: [{ field: 'leadCount', from: null, to: importedLeads.length }],
      })

      await recordExcelUpload(req, {
        user: req.user,
        fileName: req.file.originalname,
        leadCount: importedLeads.length,
        source: 'mobile',
      })

      res.json({
        count: importedLeads.length,
        userId: req.userId,
        fileName: req.file.originalname,
        leads: importedLeads,
      })
    } catch (error) {
      res.status(400).json({ message: error.message || 'Failed to import Excel file.' })
    }
  },
}
