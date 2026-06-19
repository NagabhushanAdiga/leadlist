import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const adminSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin'],
      default: 'admin',
      index: true,
    },
  },
  { timestamps: true },
)

export const Admin = mongoose.model('Admin', adminSchema)
