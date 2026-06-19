import { UserModel } from '../models/userModel.js'
import { toPublicUser } from '../utils/sanitize.js'
import { diffChanges, recordAudit } from '../utils/auditLog.js'

const USER_FIELDS = ['name', 'email', 'password', 'mobile', 'role', 'company', 'enabled']

export const UserController = {
  async list(_req, res) {
    res.json(await UserModel.findAll())
  },

  async create(req, res) {
    const { name, email, password, mobile, role, company } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (await UserModel.emailExists(email)) {
      return res.status(400).json({ message: 'A user with this email already exists.' })
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      mobile,
      role,
      company,
      enabled: req.body.enabled === true,
    })

    const publicUser = toPublicUser(user)

    await recordAudit(req, {
      action: 'create',
      entityType: 'user',
      entityId: publicUser.id,
      entityLabel: publicUser.name,
      summary: `Created user ${publicUser.name}`,
      changes: USER_FIELDS.filter((field) => field !== 'password').map((field) => ({
        field,
        from: null,
        to: publicUser[field] ?? null,
      })),
    })

    res.status(201).json(publicUser)
  },

  async update(req, res) {
    const before = await UserModel.findById(req.params.id)

    if (!before) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const user = await UserModel.update(req.params.id, req.body)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const publicUser = toPublicUser(user)

    await recordAudit(req, {
      action: 'update',
      entityType: 'user',
      entityId: publicUser.id,
      entityLabel: publicUser.name,
      summary: `Updated user ${publicUser.name}`,
      changes: diffChanges(before, user, USER_FIELDS),
    })

    res.json(publicUser)
  },

  async remove(req, res) {
    const before = await UserModel.findById(req.params.id)

    if (!before) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const deleted = await UserModel.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' })
    }

    await recordAudit(req, {
      action: 'delete',
      entityType: 'user',
      entityId: before.id,
      entityLabel: before.name,
      summary: `Deleted user ${before.name}`,
      changes: [{ field: 'deleted', from: before.email, to: null }],
    })

    res.json({ success: true })
  },
}
