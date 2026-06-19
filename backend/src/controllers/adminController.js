import { AdminModel } from '../models/adminModel.js'
import { withoutPassword } from '../utils/sanitize.js'

export const AdminController = {
  async list(_req, res) {
    res.json(await AdminModel.findAll())
  },

  async create(req, res) {
    const { name, email, password } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    if (await AdminModel.emailExists(email)) {
      return res.status(400).json({ message: 'An admin with this email already exists.' })
    }

    const admin = await AdminModel.create({ name, email, password })
    res.status(201).json(withoutPassword(admin))
  },

  async remove(req, res) {
    const result = await AdminModel.delete(req.params.id)

    if (result?.error === 'not_found') {
      return res.status(404).json({ message: 'Admin not found.' })
    }

    if (result?.error === 'primary') {
      return res.status(400).json({ message: 'The primary admin account cannot be deleted.' })
    }

    res.json({ success: true })
  },
}
