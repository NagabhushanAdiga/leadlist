import { ExcelUploadModel } from '../models/excelUploadModel.js'
import { getActorFromRequest } from '../utils/auditLog.js'

export async function recordExcelUpload(req, { user, fileName, leadCount, source }) {
  const actor = await getActorFromRequest(req)

  if (!actor || !user) {
    return null
  }

  return ExcelUploadModel.create({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    fileName: fileName || 'upload.xlsx',
    leadCount,
    source,
    uploadedByType: actor.actorType,
    uploadedById: actor.actorId,
    uploadedByName: actor.actorName,
    uploadedByEmail: actor.actorEmail,
  })
}
