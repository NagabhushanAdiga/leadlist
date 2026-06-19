import { UserModel } from '../models/userModel.js'
import { toPublicUser } from '../utils/sanitize.js'
import { diffChanges, recordAudit } from '../utils/auditLog.js'

const PROFILE_FIELDS = ['name', 'email', 'mobile', 'role', 'company']

export const ProfileController = {
  async get(req, res) {
    res.json(toPublicUser(req.user))
  },

  async update(req, res) {
    const { name, email, mobile, role, company } = req.body
    const nextEmail = email?.trim() || req.user.email

    if (
      nextEmail.toLowerCase() !== req.user.email.toLowerCase() &&
      (await UserModel.emailExists(nextEmail, req.userId))
    ) {
      return res.status(400).json({ message: 'A user with this email already exists.' })
    }

    const before = await UserModel.findById(req.userId)
    const user = await UserModel.updateProfile(req.userId, {
      name,
      email: nextEmail,
      mobile,
      role,
      company,
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const publicUser = toPublicUser(user)

    await recordAudit(req, {
      action: 'update',
      entityType: 'profile',
      entityId: publicUser.id,
      entityLabel: publicUser.name,
      summary: `Updated profile for ${publicUser.name}`,
      changes: diffChanges(before, user, PROFILE_FIELDS),
    })

    res.json(publicUser)
  },

  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword?.trim() || !newPassword?.trim()) {
      return res.status(400).json({ message: 'Current and new password are required.' })
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' })
    }

    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect.' })
    }

    await UserModel.updatePassword(req.userId, newPassword)

    await recordAudit(req, {
      action: 'update',
      entityType: 'password',
      entityId: user.id,
      entityLabel: user.name,
      summary: `Changed password for ${user.name}`,
      changes: [{ field: 'password', from: '[hidden]', to: '[changed]' }],
    })

    res.json({ success: true })
  },
}
