import { FeedbackModel } from '../models/feedbackModel.js'
import { recordAudit } from '../utils/auditLog.js'

const FEEDBACK_CATEGORIES = ['bug', 'feature', 'general', 'other']
const FEEDBACK_STATUSES = ['new', 'reviewed', 'resolved']

export const FeedbackController = {
  async list(req, res) {
    const { page, limit, status, category, search } = req.query

    res.json(
      await FeedbackModel.list({
        page,
        limit,
        status: status?.trim() || undefined,
        category: category?.trim() || undefined,
        search,
      }),
    )
  },

  async getById(req, res) {
    const feedback = await FeedbackModel.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' })
    }

    res.json(feedback)
  },

  async createMine(req, res) {
    const { category = 'general', message, rating } = req.body

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Feedback message is required.' })
    }

    if (category && !FEEDBACK_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid feedback category.' })
    }

    if (rating != null) {
      const numericRating = Number(rating)
      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' })
      }
    }

    const feedback = await FeedbackModel.create({
      userId: req.userId,
      userName: req.user.name,
      userEmail: req.user.email,
      category: category || 'general',
      message: message.trim(),
      rating: rating != null ? Number(rating) : null,
    })

    res.status(201).json(feedback)
  },

  async update(req, res) {
    const before = await FeedbackModel.findById(req.params.id)

    if (!before) {
      return res.status(404).json({ message: 'Feedback not found.' })
    }

    const { status, adminNote } = req.body
    const updates = {}

    if (status !== undefined) {
      if (!FEEDBACK_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid feedback status.' })
      }
      updates.status = status
    }

    if (adminNote !== undefined) {
      updates.adminNote = String(adminNote).trim()
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No valid fields to update.' })
    }

    const feedback = await FeedbackModel.update(req.params.id, updates)

    await recordAudit(req, {
      action: 'update',
      entityType: 'feedback',
      entityId: feedback.id,
      entityLabel: feedback.userName,
      summary: `Updated feedback from ${feedback.userName}`,
      changes: Object.keys(updates).map((field) => ({
        field,
        from: before[field] ?? null,
        to: feedback[field] ?? null,
      })),
    })

    res.json(feedback)
  },

  async remove(req, res) {
    const before = await FeedbackModel.findById(req.params.id)

    if (!before) {
      return res.status(404).json({ message: 'Feedback not found.' })
    }

    await FeedbackModel.remove(req.params.id)

    await recordAudit(req, {
      action: 'delete',
      entityType: 'feedback',
      entityId: before.id,
      entityLabel: before.userName,
      summary: `Deleted feedback from ${before.userName}`,
      changes: [{ field: 'message', from: before.message, to: null }],
    })

    res.json({ success: true })
  },
}
