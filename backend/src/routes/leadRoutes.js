import { Router } from 'express'
import { LeadController } from '../controllers/leadController.js'
import { adminAuth, superAdminOnly } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/export/excel', superAdminOnly, LeadController.exportExcel)
router.get('/export/pdf', superAdminOnly, LeadController.exportPdf)
router.get('/', LeadController.list)
router.put('/:id', superAdminOnly, LeadController.update)
router.delete('/:id', superAdminOnly, LeadController.remove)
router.post('/import', superAdminOnly, upload.single('file'), LeadController.importForUser)

export default router
