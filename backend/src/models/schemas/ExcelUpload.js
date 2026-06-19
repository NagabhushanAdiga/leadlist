import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const excelUploadSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    fileName: { type: String, required: true },
    leadCount: { type: Number, required: true, default: 0 },
    source: { type: String, enum: ['admin', 'mobile'], required: true, index: true },
    uploadedByType: { type: String, enum: ['admin', 'user'], required: true },
    uploadedById: { type: String, required: true },
    uploadedByName: { type: String, required: true },
    uploadedByEmail: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'excel_uploads',
  },
)

excelUploadSchema.index({ createdAt: -1 })
excelUploadSchema.index({ userId: 1, createdAt: -1 })

export const ExcelUpload = mongoose.model('ExcelUpload', excelUploadSchema)

export async function ensureExcelUploadTable() {
  await ExcelUpload.createCollection().catch((error) => {
    if (error.codeName !== 'NamespaceExists') {
      throw error
    }
  })

  await ExcelUpload.syncIndexes()
}
