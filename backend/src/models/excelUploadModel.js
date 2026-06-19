import { ExcelUpload, ensureExcelUploadTable } from './schemas/ExcelUpload.js'

function formatUpload(entry) {
  return {
    id: entry.id,
    userId: entry.userId,
    userName: entry.userName,
    userEmail: entry.userEmail,
    fileName: entry.fileName,
    leadCount: entry.leadCount,
    source: entry.source,
    uploadedByType: entry.uploadedByType,
    uploadedById: entry.uploadedById,
    uploadedByName: entry.uploadedByName,
    uploadedByEmail: entry.uploadedByEmail,
    createdAt: entry.createdAt?.toISOString?.() || entry.createdAt,
  }
}

export const ExcelUploadModel = {
  ensureTable: ensureExcelUploadTable,

  async create(payload) {
    const entry = await ExcelUpload.create(payload)
    return formatUpload(entry.toObject())
  },

  async list({ userId, page = 1, limit = 50 } = {}) {
    const query = {}

    if (userId) {
      query.userId = userId
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100)
    const safePage = Math.max(Number(page) || 1, 1)
    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      ExcelUpload.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      ExcelUpload.countDocuments(query),
    ])

    return {
      items: items.map(formatUpload),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    }
  },
}
