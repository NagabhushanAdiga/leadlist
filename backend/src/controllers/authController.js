import { AdminModel } from '../models/adminModel.js'
import { SessionModel } from '../models/sessionModel.js'
import { UserModel } from '../models/userModel.js'
import { withoutPassword, toPublicUser } from '../utils/sanitize.js'

export const AuthController = {
  async adminLogin(req, res) {
    const { email, password } = req.body

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const admin = await AdminModel.findByCredentials(email, password)

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = await SessionModel.create({ type: 'admin', adminId: admin.id })

    res.json({
      token,
      admin: withoutPassword(admin),
    })
  },

  async userLogin(req, res) {
    const { email, password, deviceId } = req.body

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await UserModel.findByEmail(email)

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = await SessionModel.createUserSession({
      userId: user.id,
      deviceId: deviceId?.trim() || null,
    })

    res.json({
      token,
      user: toPublicUser(user),
    })
  },

  async userRegister(req, res) {
    const { name, email, password } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    if (await UserModel.emailExists(email)) {
      return res.status(400).json({ message: 'A user with this email already exists.' })
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      enabled: false,
    })

    const token = await SessionModel.createUserSession({
      userId: user.id,
      deviceId: req.body.deviceId?.trim() || null,
    })

    res.status(201).json({
      token,
      user: toPublicUser(user),
    })
  },

  async userLogout(req, res) {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (token) {
      await SessionModel.deleteByToken(token)
    }

    res.json({ success: true })
  },
}
