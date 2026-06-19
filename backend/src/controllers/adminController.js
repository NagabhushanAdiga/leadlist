import { AdminModel } from '../models/adminModel.js'
import { withoutPassword } from '../utils/sanitize.js'
import { recordAudit } from '../utils/auditLog.js'
import { ADMIN_ROLES } from '../utils/adminRoles.js'

export const AdminController = {
  async list(_req, res) {
    res.json(await AdminModel.findAll())
  },

  async create(req, res) {
    const { name, email, password, role } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    if (await AdminModel.emailExists(email)) {
      return res.status(400).json({ message: 'An admin with this email already exists.' })
    }

    const nextRole =
      role === ADMIN_ROLES.SUPER_ADMIN ? ADMIN_ROLES.SUPER_ADMIN : ADMIN_ROLES.ADMIN

    const admin = await AdminModel.create({ name, email, password, role: nextRole })
    const publicAdmin = withoutPassword(admin)

    await recordAudit(req, {
      action: 'create',
      entityType: 'admin',
      entityId: publicAdmin.id,
      entityLabel: publicAdmin.name,
      summary: `Created admin ${publicAdmin.name}`,
      changes: [
        { field: 'name', from: null, to: publicAdmin.name },
        { field: 'email', from: null, to: publicAdmin.email },
        { field: 'role', from: null, to: publicAdmin.role },
      ],
    })

    res.status(201).json(publicAdmin)
  },

  async remove(req, res) {
    const before = await AdminModel.findById(req.params.id)

    const result = await AdminModel.delete(req.params.id)

    if (result?.error === 'not_found') {
      return res.status(404).json({ message: 'Admin not found.' })
    }

    if (result?.error === 'primary') {
      return res.status(400).json({ message: 'The primary admin account cannot be deleted.' })
    }

    await recordAudit(req, {
      action: 'delete',
      entityType: 'admin',
      entityId: before.id,
      entityLabel: before.name,
      summary: `Removed admin ${before.name}`,
      changes: [{ field: 'deleted', from: before.email, to: null }],
    })

    res.json({ success: true })
  },
}
