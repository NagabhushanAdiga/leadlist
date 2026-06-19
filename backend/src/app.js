import cors from 'cors'
import express from 'express'
import { ensureDatabase } from './config/database.js'
import { seedDefaultAdmin, seedDefaultUser } from './config/seed.js'
import routes from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'lead-list-api' })
})

app.use(ensureDatabase)

let seeded = false

app.use(async (_req, _res, next) => {
  try {
    if (!seeded) {
      await seedDefaultAdmin()
      await seedDefaultUser()
      seeded = true
    }
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api', routes)

app.use((err, _req, res, _next) => {
  console.error(err)

  if (err.message?.includes('MONGODB_URI')) {
    return res.status(503).json({ message: 'Database is not configured on the server.' })
  }

  if (err.name === 'MongoServerError' || err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      message: 'Unable to connect to the database. Check MongoDB Atlas credentials and network access.',
    })
  }

  res.status(500).json({ message: 'Internal server error.' })
})

export default app
