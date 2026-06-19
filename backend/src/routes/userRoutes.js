import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', UserController.list)
router.post('/', superAdminOnly, UserController.create)
router.put('/:id', superAdminOnly, UserController.update)
router.delete('/:id', superAdminOnly, UserController.remove)

export default router
