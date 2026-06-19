import { Router } from 'express'
import { ExcelUploadController } from '../controllers/excelUploadController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', ExcelUploadController.list)
router.delete('/user/:userId', superAdminOnly, ExcelUploadController.removeAllForUser)
router.delete('/:id', superAdminOnly, ExcelUploadController.remove)

export default router
