import { apiRequest } from './httpClient.js'

export function userLogin(email, password, deviceId) {
  return apiRequest('/auth/user-login', {
    method: 'POST',
    body: JSON.stringify({ email, password, deviceId }),
  })
}

export function userRegister(name, email, password, deviceId) {
  return apiRequest('/auth/user-register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, deviceId }),
  })
}

export function userLogout() {
  return apiRequest('/auth/user-logout', {
    method: 'POST',
  })
}

export function fetchMyProfile() {
  return apiRequest('/my/profile')
}

export function updateMyProfile(payload) {
  return apiRequest('/my/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function changeMyPassword(currentPassword, newPassword) {
  return apiRequest('/my/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
