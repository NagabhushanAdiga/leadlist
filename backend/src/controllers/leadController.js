import { LeadModel } from '../models/leadModel.js'
import { UserModel } from '../models/userModel.js'
import { parseExcelBuffer } from '../utils/parseExcel.js'

export const LeadController = {
  async list(req, res) {
    const { userId } = req.query
    res.json(await LeadModel.findAll(userId))
  },

  async update(req, res) {
    const lead = await LeadModel.update(req.params.id, req.body)

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    res.json(await LeadModel.enrich(lead))
  },

  async remove(req, res) {
    const deleted = await LeadModel.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

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

      res.json({
        count: importedLeads.length,
        userId,
        userName: user.name,
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
    const lead = await LeadModel.updateForUser(req.params.id, req.userId, req.body)

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    res.json(lead)
  },

  async importMine(req, res) {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required.' })
    }

    try {
      const parsedLeads = parseExcelBuffer(req.file.buffer)
      const importedLeads = await LeadModel.importForUser(req.userId, parsedLeads)

      res.json({
        count: importedLeads.length,
        userId: req.userId,
        leads: importedLeads,
      })
    } catch (error) {
      res.status(400).json({ message: error.message || 'Failed to import Excel file.' })
    }
  },
}
