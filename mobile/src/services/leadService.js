import { apiRequest } from './httpClient.js'

export function fetchMyLeads() {
  return apiRequest('/my/leads')
}

export function updateMyLead(leadId, payload) {
  return apiRequest(`/my/leads/${leadId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function importMyLeadsFromExcel(uri, fileName) {
  const formData = new FormData()
  formData.append('file', {
    uri,
    name: fileName || 'leads.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  return apiRequest('/my/leads/import', {
    method: 'POST',
    body: formData,
  })
}
