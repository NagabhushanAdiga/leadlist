import { API_BASE_URL } from './config.js'

function getToken() {
  return localStorage.getItem('admin_token')
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function downloadExport(path, fallbackName) {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Download failed')
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="([^"]+)"/)
  const fileName = match?.[1] || fallbackName

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadUserLeadsExcel(userId, userName) {
  const query = encodeURIComponent(userId)
  return downloadExport(
    `/leads/export/excel?userId=${query}`,
    `leads-${slugify(userName || 'user')}.xlsx`,
  )
}

export function downloadUserLeadsPdf(userId, userName) {
  const query = encodeURIComponent(userId)
  return downloadExport(
    `/leads/export/pdf?userId=${query}`,
    `leads-${slugify(userName || 'user')}.pdf`,
  )
}
