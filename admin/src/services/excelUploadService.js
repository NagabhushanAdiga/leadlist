import { request } from './httpClient.js'

export function getExcelUploads(params = {}) {
  const search = new URLSearchParams()

  if (params.userId && params.userId !== 'All') {
    search.set('userId', params.userId)
  }

  if (params.page) {
    search.set('page', String(params.page))
  }

  if (params.limit) {
    search.set('limit', String(params.limit))
  }

  const query = search.toString()
  return request(`/excel-uploads${query ? `?${query}` : ''}`)
}
