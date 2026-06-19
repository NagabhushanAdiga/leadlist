import * as XLSX from 'xlsx'
import { parseLeadsFromWorksheet } from './excelImport.js'

export function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    throw new Error('No worksheet found in the Excel file.')
  }

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
    defval: '',
    blankrows: false,
  })

  return parseLeadsFromWorksheet(rows)
}
