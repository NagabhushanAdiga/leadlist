import { Router } from 'express'
import { AuditController } from '../controllers/auditController.js'
import { adminAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', AuditController.list)

export default router
