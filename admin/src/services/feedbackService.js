import { request } from './httpClient.js'

export function getFeedback(params = {}) {
  const search = new URLSearchParams()

  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))
  if (params.status && params.status !== 'All') search.set('status', params.status)
  if (params.category && params.category !== 'All') search.set('category', params.category)
  if (params.search?.trim()) search.set('search', params.search.trim())

  const query = search.toString()
  return request(`/feedback${query ? `?${query}` : ''}`)
}

export function updateFeedback(id, payload) {
  return request(`/feedback/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteFeedback(id) {
  return request(`/feedback/${id}`, { method: 'DELETE' })
}
