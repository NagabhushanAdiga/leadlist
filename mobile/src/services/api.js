import { API_BASE_URL } from '../config/api'

let authToken = null

export function setAuthToken(token) {
  authToken = token || null
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function authHeaders(extra = {}) {
  const headers = { ...extra }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  return headers
}

export async function userLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/user-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return parseResponse(response)
}

export async function userRegister(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/user-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  return parseResponse(response)
}

export async function fetchMyProfile() {
  const response = await fetch(`${API_BASE_URL}/my/profile`, {
    headers: authHeaders(),
  })

  return parseResponse(response)
}

export async function updateMyProfile(payload) {
  const response = await fetch(`${API_BASE_URL}/my/profile`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  return parseResponse(response)
}

export async function changeMyPassword(currentPassword, newPassword) {
  const response = await fetch(`${API_BASE_URL}/my/password`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  return parseResponse(response)
}

export async function fetchMyLeads() {
  const response = await fetch(`${API_BASE_URL}/my/leads`, {
    headers: authHeaders(),
  })

  return parseResponse(response)
}

export async function updateMyLead(leadId, payload) {
  const response = await fetch(`${API_BASE_URL}/my/leads/${leadId}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  return parseResponse(response)
}

export async function importMyLeadsFromExcel(uri, fileName) {
  const formData = new FormData()
  formData.append('file', {
    uri,
    name: fileName || 'leads.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const response = await fetch(`${API_BASE_URL}/my/leads/import`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })

  return parseResponse(response)
}
