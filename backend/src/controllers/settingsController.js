import { Admin } from '../models/schemas/Admin.js'
import { ExcelUpload } from '../models/schemas/ExcelUpload.js'
import { Lead } from '../models/schemas/Lead.js'
import { User } from '../models/schemas/User.js'
import { AuditLog } from '../models/schemas/AuditLog.js'
import { Feedback } from '../models/schemas/Feedback.js'
import { Session } from '../models/schemas/Session.js'
import { recordAudit } from '../utils/auditLog.js'

export const SettingsController = {
  async purgeExcel(req, res) {
    const [uploadsResult, leadsResult] = await Promise.all([
      ExcelUpload.deleteMany({}),
      Lead.deleteMany({}),
    ])

    await recordAudit(req, {
      action: 'delete',
      entityType: 'lead',
      entityId: null,
      entityLabel: 'All Excel data',
      summary: 'Deleted all Excel uploads and leads',
      changes: [
        { field: 'uploadsRemoved', from: null, to: uploadsResult.deletedCount },
        { field: 'leadsRemoved', from: null, to: leadsResult.deletedCount },
      ],
    })

    res.json({
      success: true,
      deletedUploads: uploadsResult.deletedCount,
      deletedLeads: leadsResult.deletedCount,
    })
  },

  async purgeUsers(req, res) {
    const [usersResult, leadsResult, uploadsResult, sessionsResult] = await Promise.all([
      User.deleteMany({}),
      Lead.deleteMany({}),
      ExcelUpload.deleteMany({}),
      Session.deleteMany({ type: 'user' }),
    ])

    await recordAudit(req, {
      action: 'delete',
      entityType: 'user',
      entityId: null,
      entityLabel: 'All users',
      summary: 'Deleted all mobile users and related data',
      changes: [
        { field: 'usersRemoved', from: null, to: usersResult.deletedCount },
        { field: 'leadsRemoved', from: null, to: leadsResult.deletedCount },
        { field: 'uploadsRemoved', from: null, to: uploadsResult.deletedCount },
        { field: 'sessionsRemoved', from: null, to: sessionsResult.deletedCount },
      ],
    })

    res.json({
      success: true,
      deletedUsers: usersResult.deletedCount,
      deletedLeads: leadsResult.deletedCount,
      deletedUploads: uploadsResult.deletedCount,
      deletedSessions: sessionsResult.deletedCount,
    })
  },

  async purgeAdmins(req, res) {
    const removableAdmins = await Admin.find({ isPrimary: { $ne: true } }).lean()
    const removableIds = removableAdmins.map((admin) => admin.id)

    if (removableIds.length === 0) {
      return res.json({
        success: true,
        deletedAdmins: 0,
        message: 'No removable admin accounts found. Primary admin is always kept.',
      })
    }

    const [adminsResult, sessionsResult] = await Promise.all([
      Admin.deleteMany({ id: { $in: removableIds } }),
      Session.deleteMany({ type: 'admin', adminId: { $in: removableIds } }),
    ])

    await recordAudit(req, {
      action: 'delete',
      entityType: 'admin',
      entityId: null,
      entityLabel: 'Non-primary admins',
      summary: `Deleted ${adminsResult.deletedCount} admin account(s)`,
      changes: [
        { field: 'adminsRemoved', from: null, to: adminsResult.deletedCount },
        { field: 'sessionsRemoved', from: null, to: sessionsResult.deletedCount },
      ],
    })

    res.json({
      success: true,
      deletedAdmins: adminsResult.deletedCount,
      deletedSessions: sessionsResult.deletedCount,
    })
  },

  async purgeLeads(req, res) {
    const leadsResult = await Lead.deleteMany({})

    await recordAudit(req, {
      action: 'delete',
      entityType: 'lead',
      entityId: null,
      entityLabel: 'All leads',
      summary: 'Deleted all leads from the system',
      changes: [{ field: 'leadsRemoved', from: null, to: leadsResult.deletedCount }],
    })

    res.json({
      success: true,
      deletedLeads: leadsResult.deletedCount,
    })
  },

  async purgeAuditLogs(req, res) {
    const auditResult = await AuditLog.deleteMany({})

    res.json({
      success: true,
      deletedLogs: auditResult.deletedCount,
    })
  },

  async purgeFeedback(req, res) {
    const feedbackResult = await Feedback.deleteMany({})

    await recordAudit(req, {
      action: 'delete',
      entityType: 'feedback',
      entityId: null,
      entityLabel: 'All feedback',
      summary: 'Deleted all user feedback',
      changes: [{ field: 'feedbackRemoved', from: null, to: feedbackResult.deletedCount }],
    })

    res.json({
      success: true,
      deletedFeedback: feedbackResult.deletedCount,
    })
  },

  async purgeAll(req, res) {
    const removableAdmins = await Admin.find({ isPrimary: { $ne: true } }).lean()
    const removableIds = removableAdmins.map((admin) => admin.id)

    const [
      feedbackResult,
      auditResult,
      usersResult,
      leadsResult,
      uploadsResult,
      userSessionsResult,
      adminsResult,
      adminSessionsResult,
    ] = await Promise.all([
      Feedback.deleteMany({}),
      AuditLog.deleteMany({}),
      User.deleteMany({}),
      Lead.deleteMany({}),
      ExcelUpload.deleteMany({}),
      Session.deleteMany({ type: 'user' }),
      Admin.deleteMany({ id: { $in: removableIds } }),
      Session.deleteMany({ type: 'admin', adminId: { $in: removableIds } }),
    ])

    res.json({
      success: true,
      deletedFeedback: feedbackResult.deletedCount,
      deletedLogs: auditResult.deletedCount,
      deletedUsers: usersResult.deletedCount,
      deletedLeads: leadsResult.deletedCount,
      deletedUploads: uploadsResult.deletedCount,
      deletedUserSessions: userSessionsResult.deletedCount,
      deletedAdmins: adminsResult.deletedCount,
      deletedAdminSessions: adminSessionsResult.deletedCount,
      message: 'Database wiped. Primary admin account was kept.',
    })
  },
}
