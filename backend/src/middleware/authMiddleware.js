import { SessionModel } from '../models/sessionModel.js'
import { AdminModel } from '../models/adminModel.js'
import { withoutPassword } from '../utils/sanitize.js'
import { resolveAdminRole, ADMIN_ROLES } from '../utils/adminRoles.js'

const SESSION_EXPIRED_MESSAGE =
  'Your session expired. This account is signed in on another device. Please sign in again.'

function getToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}

export async function adminAuth(req, res, next) {
  const session = await SessionModel.resolveAdminSession(getToken(req))

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const admin = await AdminModel.findById(session.adminId)

  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.adminId = session.adminId
  req.admin = withoutPassword(admin)
  req.adminRole = resolveAdminRole(admin)
  next()
}

export function superAdminOnly(req, res, next) {
  if (req.adminRole !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      message: 'Super admin access is required to perform this action.',
    })
  }

  next()
}

export async function userSession(req, res, next) {
  const token = getToken(req)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const session = await SessionModel.find(token)

  if (!session || session.type !== 'user' || !session.userId) {
    return res.status(401).json({ message: SESSION_EXPIRED_MESSAGE })
  }

  const user = await SessionModel.resolveUser(token)

  if (!user) {
    return res.status(401).json({ message: SESSION_EXPIRED_MESSAGE })
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
