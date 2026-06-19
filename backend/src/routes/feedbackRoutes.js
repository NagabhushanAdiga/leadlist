import { Router } from 'express'
import { FeedbackController } from '../controllers/feedbackController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', FeedbackController.list)
router.get('/:id', FeedbackController.getById)
router.put('/:id', superAdminOnly, FeedbackController.update)
router.delete('/:id', superAdminOnly, FeedbackController.remove)

export default router
