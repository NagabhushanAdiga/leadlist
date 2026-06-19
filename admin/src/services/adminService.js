import { request } from './httpClient.js'

export function getAdmins() {
  return request('/admins')
}

export function createAdmin(payload) {
  return request('/admins', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteAdmin(id) {
  return request(`/admins/${id}`, {
    method: 'DELETE',
  })
}
