import { Lead } from './schemas/Lead.js'
import { UserModel } from './userModel.js'

function formatLead(lead) {
  return {
    ...lead,
    followUpDate: lead.followUpDate || null,
    rejectionReason: lead.rejectionReason || null,
    createdAt: lead.createdAt?.toISOString?.() || lead.createdAt,
    updatedAt: lead.updatedAt?.toISOString?.() || lead.updatedAt,
  }
}

export const LeadModel = {
  async findAll(userId) {
    const query = userId ? { userId } : {}
    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean()
    return Promise.all(leads.map((lead) => LeadModel.enrich(lead)))
  },

  async findByUser(userId) {
    const leads = await Lead.find({ userId }).sort({ createdAt: -1 }).lean()
    return leads.map(formatLead)
  },

  async findById(leadId) {
    return Lead.findOne({ id: leadId }).lean()
  },

  async enrich(lead) {
    const owner = await UserModel.findById(lead.userId)
    return {
      ...formatLead(lead),
      userName: owner?.name || 'Unknown user',
      userEmail: owner?.email || '',
    }
  },

  async update(leadId, payload) {
    const current = await Lead.findOne({ id: leadId })
    if (!current) return null

    current.name = payload.name?.trim() ?? current.name
    current.email = payload.email?.trim() ?? current.email
    current.phone = payload.phone?.trim() ?? current.phone
    current.company = payload.company?.trim() ?? current.company
    current.role = payload.role?.trim() ?? current.role
    current.status = payload.status ?? current.status
    current.followUpDate = payload.followUpDate ?? current.followUpDate
    current.rejectionReason = payload.rejectionReason ?? current.rejectionReason

    await current.save()
    return current.toObject()
  },

  async updateForUser(leadId, userId, payload) {
    const current = await Lead.findOne({ id: leadId, userId })
    if (!current) return null

    current.status = payload.status ?? current.status
    current.followUpDate = payload.followUpDate ?? current.followUpDate
    current.rejectionReason = payload.rejectionReason ?? current.rejectionReason

    await current.save()
    return formatLead(current.toObject())
  },

  async delete(leadId) {
    const result = await Lead.deleteOne({ id: leadId })
    return result.deletedCount > 0
  },

  async importForUser(userId, parsedLeads) {
    await Lead.deleteMany({ userId })

    const importedLeads = await Lead.insertMany(
      parsedLeads.map((lead) => ({
        userId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        role: lead.role,
        status: lead.status,
        followUpDate: lead.followUpDate || null,
        rejectionReason: lead.rejectionReason || null,
      })),
    )

    return importedLeads.map((doc) => formatLead(doc.toObject()))
  },

  async getStats() {
    const [totalUsers, totalLeads, grouped] = await Promise.all([
      UserModel.count(),
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ])

    const statusCounts = grouped.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {})

    return { totalUsers, totalLeads, statusCounts }
  },
}
