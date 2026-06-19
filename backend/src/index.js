import app from './app.js'
import { PORT } from './config/index.js'
import connectDatabase from './config/database.js'
import { seedDefaultAdmin } from './config/seed.js'

async function start() {
  await connectDatabase()
  await seedDefaultAdmin()

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
