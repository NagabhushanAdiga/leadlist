import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['admin', 'user'], required: true },
    userId: { type: String, default: null, index: true },
    adminId: { type: String, default: null },
    deviceId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Session = mongoose.model('Session', sessionSchema)

export function createSessionToken(type) {
  return `${type}-token-${uuidv4()}`
}
