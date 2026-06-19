import { ExcelUploadModel } from '../models/excelUploadModel.js'
import { LeadModel } from '../models/leadModel.js'
import { UserModel } from '../models/userModel.js'
import { recordAudit } from '../utils/auditLog.js'

export const ExcelUploadController = {
  async list(req, res) {
    const { userId, page, limit } = req.query

    res.json(
      await ExcelUploadModel.list({
        userId: userId?.trim() || undefined,
        page,
        limit,
      }),
    )
  },

  async remove(req, res) {
    const upload = await ExcelUploadModel.findById(req.params.id)

    if (!upload) {
      return res.status(404).json({ message: 'Upload record not found.' })
    }

    const complete = req.query.complete === 'true'
    let deletedLeads = 0
    let deletedUploads = 0

    if (complete) {
      deletedLeads = await LeadModel.deleteAllForUser(upload.userId)
      deletedUploads = await ExcelUploadModel.deleteAllForUser(upload.userId)
    } else {
      const deleted = await ExcelUploadModel.deleteById(upload.id)
      if (!deleted) {
        return res.status(404).json({ message: 'Upload record not found.' })
      }
      deletedUploads = 1
    }

    await recordAudit(req, {
      action: 'delete',
      entityType: 'lead',
      entityId: upload.userId,
      entityLabel: upload.userName,
      summary: complete
        ? `Deleted all Excel data for ${upload.userName}`
        : `Deleted upload record ${upload.fileName} for ${upload.userName}`,
      changes: [
        { field: 'uploadsRemoved', from: null, to: deletedUploads },
        { field: 'leadsRemoved', from: null, to: deletedLeads },
      ],
    })

    res.json({
      success: true,
      complete,
      deletedUploads,
      deletedLeads,
    })
  },

  async removeAllForUser(req, res) {
    const userId = req.params.userId?.trim()
    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const deletedLeads = await LeadModel.deleteAllForUser(userId)
    const deletedUploads = await ExcelUploadModel.deleteAllForUser(userId)

    await recordAudit(req, {
      action: 'delete',
      entityType: 'lead',
      entityId: user.id,
      entityLabel: user.name,
      summary: `Deleted all Excel data for ${user.name}`,
      changes: [
        { field: 'uploadsRemoved', from: null, to: deletedUploads },
        { field: 'leadsRemoved', from: null, to: deletedLeads },
      ],
    })

    res.json({
      success: true,
      deletedUploads,
      deletedLeads,
    })
  },
}
