import { UserModel } from '../models/userModel.js'
import { toPublicUser } from '../utils/sanitize.js'

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

    res.status(201).json(toPublicUser(user))
  },

  async update(req, res) {
    const user = await UserModel.update(req.params.id, req.body)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json(toPublicUser(user))
  },

  async remove(req, res) {
    const deleted = await UserModel.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json({ success: true })
  },
}
