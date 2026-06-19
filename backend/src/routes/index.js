import { Router } from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import leadRoutes from './leadRoutes.js'
import adminRoutes from './adminRoutes.js'
import auditRoutes from './auditRoutes.js'
import excelUploadRoutes from './excelUploadRoutes.js'
import { statsRouter, myRouter } from './miscRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/stats', statsRouter)
router.use('/users', userRoutes)
router.use('/leads', leadRoutes)
router.use('/admins', adminRoutes)
router.use('/audit-logs', auditRoutes)
router.use('/excel-uploads', excelUploadRoutes)
router.use('/my', myRouter)

export default router
