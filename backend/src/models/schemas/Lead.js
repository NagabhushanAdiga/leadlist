import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const leadSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    status: { type: String, default: 'Follow up' },
    followUpDate: { type: String, default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true },
)

leadSchema.index({ userId: 1, createdAt: -1 })

export const Lead = mongoose.model('Lead', leadSchema)
