import { Router } from 'express'
import { LeadController } from '../controllers/leadController.js'
import { adminAuth } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router = Router()

router.use(adminAuth)
router.get('/export/excel', LeadController.exportExcel)
router.get('/export/pdf', LeadController.exportPdf)
router.get('/', LeadController.list)
router.put('/:id', LeadController.update)
router.delete('/:id', LeadController.remove)
router.post('/import', upload.single('file'), LeadController.importForUser)

export default router
