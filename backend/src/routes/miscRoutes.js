import { Router } from 'express'
import { StatsController } from '../controllers/statsController.js'
import { ProfileController } from '../controllers/profileController.js'
import { LeadController } from '../controllers/leadController.js'
import { FeedbackController } from '../controllers/feedbackController.js'
import { adminAuth, userSession, userActive } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

const statsRouter = Router()
statsRouter.get('/', adminAuth, StatsController.get)

const myRouter = Router()
myRouter.use(userSession)
myRouter.get('/profile', ProfileController.get)
myRouter.put('/profile', ProfileController.update)
myRouter.put('/password', ProfileController.changePassword)
myRouter.get('/leads', userActive, LeadController.listMine)
myRouter.put('/leads/:id', userActive, LeadController.updateMine)
myRouter.post('/leads/import', userActive, upload.single('file'), LeadController.importMine)
myRouter.post('/feedback', userActive, FeedbackController.createMine)

export { statsRouter, myRouter }
