import * as XLSX from 'xlsx'
import PDFDocument from 'pdfkit'

const EXPORT_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'followUpDate', label: 'Follow Up Date' },
  { key: 'rejectionReason', label: 'Rejection Reason' },
]

function toExportRow(lead) {
  return {
    Name: lead.name || '',
    Email: lead.email || '',
    Phone: lead.phone || '',
    Company: lead.company || '',
    Role: lead.role || '',
    Status: lead.status || '',
    'Follow Up Date': lead.followUpDate || '',
    'Rejection Reason': lead.rejectionReason || '',
  }
}

export function buildLeadExcelBuffer(leads) {
  const rows = leads.map(toExportRow)
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

export function buildLeadPdfBuffer(leads, userName) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: 'A4', layout: 'landscape' })
    const chunks = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(16).text(`Lead List — ${userName}`, { align: 'center' })
    doc.fontSize(10).fillColor('#666666').text(`${leads.length} lead(s)`, { align: 'center' })
    doc.moveDown(1.2)
    doc.fillColor('#000000')

    if (leads.length === 0) {
      doc.fontSize(11).text('No leads found for this user.')
      doc.end()
      return
    }

    const tableTop = doc.y
    const columnWidths = [90, 110, 70, 90, 70, 80, 80, 100]
    const rowHeight = 22
    let y = tableTop

    doc.fontSize(8).font('Helvetica-Bold')
    let x = doc.page.margins.left
    EXPORT_COLUMNS.forEach((column, index) => {
      doc.text(column.label, x + 4, y + 6, { width: columnWidths[index] - 8 })
      x += columnWidths[index]
    })

    y += rowHeight
    doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).stroke('#dddddd')

    doc.font('Helvetica')
    leads.forEach((lead) => {
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage({ layout: 'landscape' })
        y = doc.page.margins.top
      }

      x = doc.page.margins.left
      const values = [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.role,
        lead.status,
        lead.followUpDate || '',
        lead.rejectionReason || '',
      ]

      values.forEach((value, index) => {
        doc.text(String(value || ''), x + 4, y + 6, {
          width: columnWidths[index] - 8,
          height: rowHeight - 4,
          ellipsis: true,
        })
        x += columnWidths[index]
      })

      y += rowHeight
      doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).stroke('#eeeeee')
    })

    doc.end()
  })
}

export function buildExportFileName(userName, extension) {
  const safeName = userName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const date = new Date().toISOString().slice(0, 10)
  return `leads-${safeName || 'user'}-${date}.${extension}`
}
