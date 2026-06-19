import { Router } from 'express'
import { AuditController } from '../controllers/auditController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', AuditController.list)
router.delete('/', superAdminOnly, AuditController.remove)

export default router
