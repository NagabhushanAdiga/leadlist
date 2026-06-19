import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'

const router = Router()

router.post('/login', AuthController.adminLogin)
router.post('/user-login', AuthController.userLogin)
router.post('/user-register', AuthController.userRegister)
router.post('/user-logout', AuthController.userLogout)

export default router
