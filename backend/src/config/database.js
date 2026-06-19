import mongoose from 'mongoose'
import { MONGODB_URI } from './index.js'
import { AuditModel } from '../models/auditModel.js'
import { ExcelUploadModel } from '../models/excelUploadModel.js'

let isConnected = false

export async function connectDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })

  await AuditModel.ensureTable()
  await ExcelUploadModel.ensureTable()

  isConnected = true
  console.log('MongoDB connected')
  return mongoose.connection
}

export async function ensureDatabase(_req, _res, next) {
  try {
    await connectDatabase()
    next()
  } catch (error) {
    console.error('Database connection failed:', error.message)
    next(error)
  }
}

export default connectDatabase
