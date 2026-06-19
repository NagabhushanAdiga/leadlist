import { Feedback } from './schemas/Feedback.js'

function formatFeedback(entry) {
  return {
    id: entry.id,
    userId: entry.userId,
    userName: entry.userName,
    userEmail: entry.userEmail,
    category: entry.category,
    rating: entry.rating ?? null,
    message: entry.message,
    status: entry.status,
    adminNote: entry.adminNote || '',
    createdAt: entry.createdAt?.toISOString?.() || entry.createdAt,
    updatedAt: entry.updatedAt?.toISOString?.() || entry.updatedAt,
  }
}

export const FeedbackModel = {
  buildQuery({ status, category, search } = {}) {
    const query = {}

    if (status) {
      query.status = status
    }

    if (category) {
      query.category = category
    }

    if (search?.trim()) {
      const pattern = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      query.$or = [
        { userName: pattern },
        { userEmail: pattern },
        { message: pattern },
        { adminNote: pattern },
      ]
    }

    return query
  },

  async list({ page = 1, limit = 50, status, category, search } = {}) {
    const query = FeedbackModel.buildQuery({ status, category, search })
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100)
    const safePage = Math.max(Number(page) || 1, 1)
    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      Feedback.countDocuments(query),
    ])

    return {
      items: items.map(formatFeedback),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    }
  },

  async findById(id) {
    const entry = await Feedback.findOne({ id }).lean()
    return entry ? formatFeedback(entry) : null
  },

  async create(payload) {
    const entry = await Feedback.create(payload)
    return formatFeedback(entry.toObject())
  },

  async update(id, payload) {
    const entry = await Feedback.findOneAndUpdate({ id }, payload, { new: true }).lean()
    return entry ? formatFeedback(entry) : null
  },

  async remove(id) {
    const result = await Feedback.deleteOne({ id })
    return result.deletedCount > 0
  },
}
