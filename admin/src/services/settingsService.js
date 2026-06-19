import { request } from './httpClient.js'

export function purgeExcelData() {
  return request('/settings/purge/excel', { method: 'POST' })
}

export function purgeAllUsers() {
  return request('/settings/purge/users', { method: 'POST' })
}

export function purgeAllAdmins() {
  return request('/settings/purge/admins', { method: 'POST' })
}

export function purgeAllLeads() {
  return request('/settings/purge/leads', { method: 'POST' })
}

export function purgeAllAuditLogs() {
  return request('/settings/purge/audit-logs', { method: 'POST' })
}

export function purgeAllFeedback() {
  return request('/settings/purge/feedback', { method: 'POST' })
}

export function purgeEntireDatabase() {
  return request('/settings/purge/all', { method: 'POST' })
}
