import connectDatabase from '../src/config/database.js'
import { AuditModel } from '../src/models/auditModel.js'
import mongoose from 'mongoose'

console.log('Initializing audit_logs table...')

try {
  await connectDatabase()
  await AuditModel.ensureTable()

  const collections = await mongoose.connection.db.listCollections({ name: 'audit_logs' }).toArray()

  if (collections.length === 0) {
    console.error('audit_logs table was not created.')
    process.exit(1)
  }

  const indexes = await mongoose.connection.db.collection('audit_logs').indexes()
  console.log('audit_logs table ready.')
  console.log('Indexes:', indexes.map((index) => index.name).join(', '))
  process.exit(0)
} catch (error) {
  console.error('Failed to initialize audit_logs table:', error.message)
  process.exit(1)
}
