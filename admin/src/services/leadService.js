import { request } from './httpClient.js'

export function getLeads(userId) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
  return request(`/leads${query}`)
}

export function updateLead(id, payload) {
  return request(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteLead(id) {
  return request(`/leads/${id}`, {
    method: 'DELETE',
  })
}

export function importLeads(file, userId) {
  if (!file) {
    throw new Error('Excel file is required.')
  }

  if (!userId) {
    throw new Error('Select a user to import leads for.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)

  return request('/leads/import', {
    method: 'POST',
    body: formData,
  })
}
