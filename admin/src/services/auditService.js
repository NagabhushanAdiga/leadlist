import { request } from './httpClient.js'

export function getAuditLogs(params = {}) {
  const search = new URLSearchParams()

  if (params.page) {
    search.set('page', String(params.page))
  }

  if (params.limit) {
    search.set('limit', String(params.limit))
  }

  if (params.entityType && params.entityType !== 'All') {
    search.set('entityType', params.entityType)
  }

  if (params.action && params.action !== 'All') {
    search.set('action', params.action)
  }

  if (params.actorType && params.actorType !== 'All') {
    search.set('actorType', params.actorType)
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim())
  }

  if (params.dateFrom) {
    search.set('dateFrom', params.dateFrom)
  }

  if (params.dateTo) {
    search.set('dateTo', params.dateTo)
  }

  const query = search.toString()
  return request(`/audit-logs${query ? `?${query}` : ''}`)
}

export function deleteAuditLogs(params = {}) {
  const search = new URLSearchParams()

  if (params.entityType && params.entityType !== 'All') {
    search.set('entityType', params.entityType)
  }

  if (params.action && params.action !== 'All') {
    search.set('action', params.action)
  }

  if (params.actorType && params.actorType !== 'All') {
    search.set('actorType', params.actorType)
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim())
  }

  if (params.dateFrom) {
    search.set('dateFrom', params.dateFrom)
  }

  if (params.dateTo) {
    search.set('dateTo', params.dateTo)
  }

  const query = search.toString()
  return request(`/audit-logs${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  })
}
