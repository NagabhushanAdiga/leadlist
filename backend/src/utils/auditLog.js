import { AdminModel } from '../models/adminModel.js'
import { UserModel } from '../models/userModel.js'
import { AuditModel } from '../models/auditModel.js'

const SENSITIVE_FIELDS = new Set(['password', 'currentPassword', 'newPassword'])

export async function getActorFromRequest(req) {
  if (req.adminId) {
    const admin = await AdminModel.findById(req.adminId)

    if (!admin) {
      return null
    }

    return {
      actorType: 'admin',
      actorId: admin.id,
      actorName: admin.name,
      actorEmail: admin.email,
    }
  }

  if (req.userId) {
    const user = req.user || (await UserModel.findById(req.userId))

    if (!user) {
      return null
    }

    return {
      actorType: 'user',
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
    }
  }

  return null
}

export function diffChanges(before, after, fields) {
  const changes = []

  for (const field of fields) {
    const toValue = after?.[field]

    if (toValue === undefined) {
      continue
    }

    const fromValue = before?.[field]

    if (SENSITIVE_FIELDS.has(field)) {
      if (String(fromValue ?? '') !== String(toValue ?? '')) {
        changes.push({ field, from: '[hidden]', to: '[changed]' })
      }
      continue
    }

    if (String(fromValue ?? '') !== String(toValue ?? '')) {
      changes.push({ field, from: fromValue ?? null, to: toValue ?? null })
    }
  }

  return changes
}

export async function recordAudit(req, payload) {
  const actor = await getActorFromRequest(req)

  if (!actor) {
    return null
  }

  return AuditModel.create({
    ...actor,
    action: payload.action,
    entityType: payload.entityType,
    entityId: payload.entityId || null,
    entityLabel: payload.entityLabel || '',
    summary: payload.summary,
    changes: payload.changes || [],
  })
}
