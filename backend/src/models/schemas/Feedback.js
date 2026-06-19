import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const feedbackSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    category: {
      type: String,
      enum: ['bug', 'feature', 'general', 'other'],
      default: 'general',
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, default: null },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'resolved'],
      default: 'new',
      index: true,
    },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true, collection: 'feedback' },
)

feedbackSchema.index({ createdAt: -1 })

export const Feedback = mongoose.model('Feedback', feedbackSchema)
