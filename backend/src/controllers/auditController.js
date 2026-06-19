import { AuditModel } from '../models/auditModel.js'

export const AuditController = {
  async list(req, res) {
    const { page, limit, entityType, action, actorType } = req.query

    res.json(
      await AuditModel.list({
        page,
        limit,
        entityType,
        action,
        actorType,
      }),
    )
  },
}
