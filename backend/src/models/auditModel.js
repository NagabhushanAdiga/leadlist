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

  async list({ page = 1, limit = 50, entityType, action, actorType } = {}) {
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
}
