import { User } from './schemas/User.js'
import { Lead } from './schemas/Lead.js'
import { toPublicUser, toPlain } from '../utils/sanitize.js'

export const UserModel = {
  async findAll() {
    const users = await User.find().sort({ createdAt: -1 }).lean()
    return users.map(toPublicUser)
  },

  async findById(userId) {
    return User.findOne({ id: userId }).lean()
  },

  async findByEmail(email) {
    return User.findOne({ email: email.trim().toLowerCase() }).lean()
  },

  async emailExists(email, excludeUserId) {
    const query = { email: email.trim().toLowerCase() }
    if (excludeUserId) {
      query.id = { $ne: excludeUserId }
    }
    return Boolean(await User.exists(query))
  },

  async create(payload) {
    const user = await User.create({
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password.trim(),
      mobile: payload.mobile?.trim() || '',
      role: payload.role?.trim() || 'Sales Executive',
      company: payload.company?.trim() || '',
      enabled: payload.enabled === true,
    })

    return toPlain(user)
  },

  async update(userId, payload) {
    const current = await User.findOne({ id: userId })
    if (!current) return null

    current.name = payload.name?.trim() || current.name
    current.email = payload.email?.trim() || current.email
    current.password = payload.password?.trim() || current.password
    current.mobile = payload.mobile?.trim() ?? current.mobile
    current.role = payload.role?.trim() ?? current.role
    current.company = payload.company?.trim() ?? current.company
    current.enabled =
      typeof payload.enabled === 'boolean' ? payload.enabled : current.enabled === true

    await current.save()
    return toPlain(current)
  },

  async updateProfile(userId, payload) {
    const current = await User.findOne({ id: userId })
    if (!current) return null

    current.name = payload.name?.trim() || current.name
    current.email = payload.email?.trim() || current.email
    current.mobile = payload.mobile?.trim() ?? current.mobile
    current.role = payload.role?.trim() ?? current.role
    current.company = payload.company?.trim() ?? current.company

    await current.save()
    return toPlain(current)
  },

  async updatePassword(userId, newPassword) {
    const current = await User.findOne({ id: userId })
    if (!current) return null

    current.password = newPassword.trim()
    await current.save()
    return toPlain(current)
  },

  async delete(userId) {
    const deleted = await User.findOneAndDelete({ id: userId })
    if (!deleted) return false

    await Lead.deleteMany({ userId })
    return true
  },

  async count() {
    return User.countDocuments()
  },
}
