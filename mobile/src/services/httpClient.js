import { API_BASE_URL } from './config.js'

let authToken = null

export function setAuthToken(token) {
  authToken = token || null
}

export function getAuthToken() {
  return authToken
}

export async function parseResponse(response) {
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

export async function apiRequest(path, options = {}) {
  const headers = authHeaders(options.headers || {})

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  return parseResponse(response)
}
