const COLUMN_ALIASES = {
  name: ['name', 'full name', 'fullname', 'lead name', 'customer name', 'client name'],
  email: ['email', 'e-mail', 'mail', 'email id', 'email address'],
  phone: ['phone', 'mobile', 'contact', 'phone number', 'mobile number', 'contact number'],
  company: ['company', 'organization', 'organisation', 'firm', 'business'],
  role: ['role', 'designation', 'title', 'job title', 'position'],
  status: ['status', 'lead status'],
}

const DEFAULT_STATUS = 'Follow up'

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
}

function mapHeaders(headers) {
  const mapping = {}

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header)
    if (!normalized) return

    for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (aliases.includes(normalized) || normalized === field) {
        if (mapping[field] === undefined) mapping[field] = index
      }
    }
  })

  return mapping
}

function cellValue(value) {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

export function parseLeadsFromWorksheet(rows) {
  if (!rows.length) {
    throw new Error('The Excel file is empty.')
  }

  const [headerRow, ...dataRows] = rows
  const headerMapping = mapHeaders(headerRow)

  if (headerMapping.name === undefined) {
    throw new Error('Excel must include a Name column (e.g. Name, Full Name, Lead Name).')
  }

  const leads = dataRows
    .map((row) => {
      const getValue = (field) => {
        const columnIndex = headerMapping[field]
        if (columnIndex === undefined) return ''
        return cellValue(row[columnIndex])
      }

      const name = getValue('name')
      const email = getValue('email')
      const phone = getValue('phone')
      const company = getValue('company')
      const role = getValue('role')
      const status = getValue('status') || DEFAULT_STATUS

      if (!name && !email && !phone && !company && !role) return null

      return {
        name,
        email,
        phone,
        company,
        role,
        status,
        followUpDate: null,
        rejectionReason: null,
      }
    })
    .filter(Boolean)

  if (!leads.length) {
    throw new Error('No lead rows were found in the Excel file.')
  }

  return leads
}
