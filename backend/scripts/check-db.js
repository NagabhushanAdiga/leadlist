import connectDatabase from '../src/config/database.js'
import { MONGODB_URI } from '../src/config/index.js'

console.log('Checking MongoDB connection...')
console.log('URI host:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'))

try {
  await connectDatabase()
  console.log('MongoDB connection successful.')
  process.exit(0)
} catch (error) {
  console.error('MongoDB connection failed:', error.message)
  process.exit(1)
}
