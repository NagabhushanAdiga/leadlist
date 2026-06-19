import { AuditLog, ensureAuditLogTable } from './schemas/AuditLog.js'

function formatAudit(entry) {
  return {
    id: entry.id,
    actorType: entry.actorType,
    actorId: entry.actorId,
    actorName: entry.actorName,
    actorEmail: entry.actorEmail,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    entityLabel: entry.entityLabel,
    summary: entry.summary,
    changes: entry.changes || [],
    createdAt: entry.createdAt?.toISOString?.() || entry.createdAt,
  }
}

export const AuditModel = {
  ensureTable: ensureAuditLogTable,

  async create(payload) {
    const entry = await AuditLog.create(payload)
    return formatAudit(entry.toObject())
  },

  async list({ page = 1, limit = 50, entityType, action, actorType, search, dateFrom, dateTo } = {}) {
    const query = AuditModel.buildQuery({ entityType, action, actorType, search, dateFrom, dateTo })

    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100)
    const safePage = Math.max(Number(page) || 1, 1)
    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      AuditLog.countDocuments(query),
    ])

    return {
      items: items.map(formatAudit),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    }
  },

  buildQuery({ entityType, action, actorType, search, dateFrom, dateTo } = {}) {
    const query = {}

    if (entityType) {
      query.entityType = entityType
    }

    if (action) {
      query.action = action
    }

    if (actorType) {
      query.actorType = actorType
    }

    if (search?.trim()) {
      const pattern = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      query.$or = [
        { actorName: pattern },
        { actorEmail: pattern },
        { summary: pattern },
        { entityLabel: pattern },
      ]
    }

    if (dateFrom || dateTo) {
      query.createdAt = {}

      if (dateFrom) {
        query.createdAt.$gte = new Date(`${dateFrom}T00:00:00.000Z`)
      }

      if (dateTo) {
        query.createdAt.$lte = new Date(`${dateTo}T23:59:59.999Z`)
      }
    }

    return query
  },

  async deleteByFilters(filters) {
    if (!filters.dateFrom || !filters.dateTo) {
      return { error: 'date_range_required' }
    }

    const query = AuditModel.buildQuery(filters)
    const result = await AuditLog.deleteMany(query)
    return { deletedCount: result.deletedCount }
  },
}
