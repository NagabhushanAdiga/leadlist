import { ExcelUploadModel } from '../models/excelUploadModel.js'

export const ExcelUploadController = {
  async list(req, res) {
    const { userId, page, limit } = req.query

    res.json(
      await ExcelUploadModel.list({
        userId: userId?.trim() || undefined,
        page,
        limit,
      }),
    )
  },
}
