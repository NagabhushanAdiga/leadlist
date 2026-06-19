import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString()
}

export function SettingsPage() {
  const confirm = useConfirm()
  const { admin: currentAdmin } = useAuth()
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const loadAdmins = () => {
    api.getAdmins().then(setAdmins).catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const confirmed = await confirm({
      title: 'Add admin?',
      message: `Create a new admin account for ${form.name} (${form.email})?`,
      confirmLabel: 'Add Admin',
      variant: 'primary',
    })

    if (!confirmed) {
      return
    }

    setLoading(true)

    try {
      await api.createAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setSuccess('Admin added successfully.')
      resetForm()
      loadAdmins()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (admin) => {
    const confirmed = await confirm({
      title: 'Remove admin?',
      message: `Remove admin access for ${admin.name} (${admin.email})?`,
      confirmLabel: 'Remove Admin',
      variant: 'danger',
    })

    if (!confirmed) {
      return
    }

    try {
      await api.deleteAdmin(admin.id)
      setSuccess('Admin removed successfully.')
      setError('')
      loadAdmins()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <p>Manage admin accounts and panel access</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Add Admin</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Admin name"
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@company.com"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Admin'}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>
      </div>

      <div className="card table-wrap">
        <h3 style={{ marginTop: 0 }}>Admin Accounts</h3>
        {admins.length === 0 ? (
          <p className="empty-state">No admin accounts found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <span
                      className={`status-badge ${admin.isPrimary ? 'status-enabled' : 'status-disabled'}`}
                      style={
                        admin.isPrimary
                          ? undefined
                          : { background: '#eef0ff', color: '#6c63ff' }
                      }
                    >
                      {admin.isPrimary ? 'Primary' : 'Admin'}
                    </span>
                  </td>
                  <td>{formatDate(admin.createdAt)}</td>
                  <td>
                    {admin.isPrimary ? (
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Protected</span>
                    ) : currentAdmin?.id === admin.id ? (
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Signed in</span>
                    ) : (
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => handleDelete(admin)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
