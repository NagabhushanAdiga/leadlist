import { Session, createSessionToken } from './schemas/Session.js'
import { UserModel } from './userModel.js'

export const SessionModel = {
  async create({ type, userId, adminId, deviceId }) {
    const token = createSessionToken(type)

    await Session.create({
      token,
      type,
      userId: userId || null,
      adminId: adminId || null,
      deviceId: deviceId || null,
    })

    return token
  },

  async createUserSession({ userId, deviceId }) {
    await Session.deleteMany({ type: 'user', userId })

    return SessionModel.create({
      type: 'user',
      userId,
      deviceId,
    })
  },

  async deleteByToken(token) {
    if (!token) return
    await Session.deleteOne({ token })
  },

  async find(token) {
    if (!token) return null
    return Session.findOne({ token }).lean()
  },

  async resolveUser(token) {
    const session = await SessionModel.find(token)
    if (!session || session.type !== 'user' || !session.userId) return null
    return UserModel.findById(session.userId)
  },

  async resolveAdminSession(token) {
    const session = await SessionModel.find(token)
    if (!session || session.type !== 'admin') return null
    return session
  },
}
