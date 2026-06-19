import { SessionModel } from '../models/sessionModel.js'

function getToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}

export async function adminAuth(req, res, next) {
  const session = await SessionModel.resolveAdminSession(getToken(req))

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.adminId = session.adminId
  next()
}

export async function userSession(req, res, next) {
  const user = await SessionModel.resolveUser(getToken(req))

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.userId = user.id
  req.user = user
  next()
}

export function userActive(req, res, next) {
  if (req.user?.enabled !== true) {
    return res.status(403).json({ message: 'Account is not active. Contact your admin.' })
  }

  next()
}
