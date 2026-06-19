import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const changeSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    from: { type: mongoose.Schema.Types.Mixed, default: null },
    to: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false },
)

const auditLogSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    actorType: { type: String, enum: ['admin', 'user'], required: true, index: true },
    actorId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    actorEmail: { type: String, required: true },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'import'],
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['user', 'lead', 'admin', 'profile', 'password'],
      required: true,
      index: true,
    },
    entityId: { type: String, default: null, index: true },
    entityLabel: { type: String, default: '' },
    summary: { type: String, required: true },
    changes: { type: [changeSchema], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'audit_logs',
  },
)

auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ entityType: 1, createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })
auditLogSchema.index({ actorType: 1, createdAt: -1 })

export const AuditLog = mongoose.model('AuditLog', auditLogSchema)

export async function ensureAuditLogTable() {
  await AuditLog.createCollection().catch((error) => {
    if (error.codeName !== 'NamespaceExists') {
      throw error
    }
  })

  await AuditLog.syncIndexes()
}
