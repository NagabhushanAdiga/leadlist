import { Router } from 'express'
import { SettingsController } from '../controllers/settingsController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.use(superAdminOnly)

router.post('/purge/excel', SettingsController.purgeExcel)
router.post('/purge/users', SettingsController.purgeUsers)
router.post('/purge/admins', SettingsController.purgeAdmins)
router.post('/purge/leads', SettingsController.purgeLeads)
router.post('/purge/audit-logs', SettingsController.purgeAuditLogs)
router.post('/purge/feedback', SettingsController.purgeFeedback)
router.post('/purge/all', SettingsController.purgeAll)

export default router
