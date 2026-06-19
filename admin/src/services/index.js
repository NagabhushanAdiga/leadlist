import * as authService from './authService.js'
import * as statsService from './statsService.js'
import * as userService from './userService.js'
import * as leadService from './leadService.js'
import * as adminService from './adminService.js'
import * as auditService from './auditService.js'

export const api = {
  login: authService.login,
  getStats: statsService.getStats,
  getUsers: userService.getUsers,
  createUser: userService.createUser,
  updateUser: userService.updateUser,
  deleteUser: userService.deleteUser,
  getLeads: leadService.getLeads,
  updateLead: leadService.updateLead,
  deleteLead: leadService.deleteLead,
  importLeads: leadService.importLeads,
  getAdmins: adminService.getAdmins,
  createAdmin: adminService.createAdmin,
  deleteAdmin: adminService.deleteAdmin,
  getAuditLogs: auditService.getAuditLogs,
}

export { API_BASE_URL } from './config.js'
