import cors from 'cors'
import express from 'express'
import routes from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error.' })
})

export default app
