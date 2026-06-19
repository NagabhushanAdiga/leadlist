import { Router } from 'express'
import { ExcelUploadController } from '../controllers/excelUploadController.js'
import { adminAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/', ExcelUploadController.list)

export default router
