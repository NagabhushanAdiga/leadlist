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

  const query = search.toString()
  return request(`/audit-logs${query ? `?${query}` : ''}`)
}
