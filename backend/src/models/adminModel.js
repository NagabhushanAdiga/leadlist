import { Admin } from '../models/schemas/Admin.js'
import { withoutPassword, toPlain } from '../utils/sanitize.js'
import { ADMIN_ROLES } from '../utils/adminRoles.js'

export const AdminModel = {
  async findAll() {
    const admins = await Admin.find().sort({ createdAt: -1 }).lean()
    return admins.map(withoutPassword)
  },

  async findById(adminId) {
    return Admin.findOne({ id: adminId }).lean()
  },

  async findByCredentials(email, password) {
    return Admin.findOne({
      email: email.trim().toLowerCase(),
      password,
    }).lean()
  },

  async emailExists(email) {
    return Boolean(await Admin.exists({ email: email.trim().toLowerCase() }))
  },

  async create(payload) {
    const role =
      payload.role === ADMIN_ROLES.SUPER_ADMIN ? ADMIN_ROLES.SUPER_ADMIN : ADMIN_ROLES.ADMIN

    const admin = await Admin.create({
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password.trim(),
      isPrimary: false,
      role,
    })

    return toPlain(admin)
  },

  async delete(adminId) {
    const admin = await Admin.findOne({ id: adminId }).lean()
    if (!admin) return { error: 'not_found' }
    if (admin.isPrimary) return { error: 'primary' }

    await Admin.deleteOne({ id: adminId })
    return { success: true }
  },
}
