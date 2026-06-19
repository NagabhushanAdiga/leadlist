import { Router } from 'express'
import { AdminController } from '../controllers/adminController.js'
import { adminAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', AdminController.list)
router.post('/', AdminController.create)
router.delete('/:id', AdminController.remove)

export default router
