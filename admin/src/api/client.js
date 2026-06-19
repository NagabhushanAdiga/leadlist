const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('admin_token')
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  return parseResponse(response)
}

export const api = {
  login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  getStats() {
    return request('/stats')
  },

  getUsers() {
    return request('/users')
  },

  createUser(payload) {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateUser(id, payload) {
    return request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  deleteUser(id) {
    return request(`/users/${id}`, {
      method: 'DELETE',
    })
  },

  getLeads(userId) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
    return request(`/leads${query}`)
  },

  updateLead(id, payload) {
    return request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  deleteLead(id) {
    return request(`/leads/${id}`, {
      method: 'DELETE',
    })
  },

  importLeads(file, userId) {
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
  },

  getAdmins() {
    return request('/admins')
  },

  createAdmin(payload) {
    return request('/admins', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  deleteAdmin(id) {
    return request(`/admins/${id}`, {
      method: 'DELETE',
    })
  },
}
