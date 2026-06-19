import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { adminAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', UserController.list)
router.post('/', UserController.create)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.remove)

export default router
