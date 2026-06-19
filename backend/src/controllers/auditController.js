import { AuditModel } from '../models/auditModel.js'

export const AuditController = {
  async list(req, res) {
    const { page, limit, entityType, action, actorType, search, dateFrom, dateTo } = req.query

    res.json(
      await AuditModel.list({
        page,
        limit,
        entityType: entityType?.trim() || undefined,
        action: action?.trim() || undefined,
        actorType: actorType?.trim() || undefined,
        search,
        dateFrom: dateFrom?.trim() || undefined,
        dateTo: dateTo?.trim() || undefined,
      }),
    )
  },

  async remove(req, res) {
    const { entityType, action, actorType, search, dateFrom, dateTo } = req.query

    if (!dateFrom?.trim() || !dateTo?.trim()) {
      return res.status(400).json({
        message: 'Select both a start date and end date to delete logs.',
      })
    }

    const result = await AuditModel.deleteByFilters({
      entityType: entityType?.trim() || undefined,
      action: action?.trim() || undefined,
      actorType: actorType?.trim() || undefined,
      search,
      dateFrom: dateFrom.trim(),
      dateTo: dateTo.trim(),
    })

    if (result.error === 'date_range_required') {
      return res.status(400).json({
        message: 'Select both a start date and end date to delete logs.',
      })
    }

    res.json({
      success: true,
      deletedCount: result.deletedCount,
    })
  },
}
