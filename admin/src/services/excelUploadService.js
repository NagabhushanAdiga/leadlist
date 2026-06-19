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

export function deleteExcelUpload(uploadId, complete = false) {
  const query = complete ? '?complete=true' : ''
  return request(`/excel-uploads/${uploadId}${query}`, {
    method: 'DELETE',
  })
}

export function deleteAllExcelDataForUser(userId) {
  return request(`/excel-uploads/user/${userId}`, {
    method: 'DELETE',
  })
}
