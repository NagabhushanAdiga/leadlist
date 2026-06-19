import { Router } from 'express'
import { AdminController } from '../controllers/adminController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', AdminController.list)
router.post('/', superAdminOnly, AdminController.create)
router.delete('/:id', superAdminOnly, AdminController.remove)

export default router
