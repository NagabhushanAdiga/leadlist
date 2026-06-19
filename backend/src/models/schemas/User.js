import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, default: '' },
    role: { type: String, default: 'Sales Executive' },
    company: { type: String, default: '' },
    enabled: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)
