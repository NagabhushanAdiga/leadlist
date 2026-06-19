import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useConfirm } from '../context/ConfirmContext'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  role: 'Sales Executive',
  company: '',
}

export function UsersPage() {
  const confirm = useConfirm()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const loadUsers = () => {
    api.getUsers().then(setUsers).catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const confirmed = await confirm({
      title: editingId ? 'Update user?' : 'Create user?',
      message: editingId
        ? `Save changes for ${form.name || 'this user'}?`
        : `Create a new user account for ${form.name || form.email}?`,
      confirmLabel: editingId ? 'Update User' : 'Create User',
      variant: 'primary',
    })

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (editingId) {
        await api.updateUser(editingId, form)
        setSuccess('User updated successfully.')
      } else {
        await api.createUser(form)
        setSuccess('User created successfully.')
      }

      resetForm()
      loadUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = async () => {
    const confirmed = await confirm({
      title: 'Discard changes?',
      message: 'Cancel editing and clear the form?',
      confirmLabel: 'Discard',
      variant: 'warning',
    })

    if (confirmed) {
      resetForm()
    }
  }

  const handleEdit = async (user) => {
    const confirmed = await confirm({
      title: 'Edit user?',
      message: `Load ${user.name}'s details into the form for editing?`,
      confirmLabel: 'Edit User',
      variant: 'primary',
    })

    if (!confirmed) {
      return
    }

    setEditingId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      mobile: user.mobile || '',
      role: user.role || '',
      company: user.company || '',
    })
    setError('')
    setSuccess('')
  }

  const handleToggleEnabled = async (user) => {
    const nextEnabled = user.enabled !== true

    const confirmed = await confirm({
      title: nextEnabled ? 'Enable user?' : 'Disable user?',
      message: nextEnabled
        ? `Allow ${user.name} (${user.email}) to access the mobile app?`
        : `Block ${user.name} (${user.email}) from accessing app pages? They can still sign in.`,
      confirmLabel: nextEnabled ? 'Enable User' : 'Disable User',
      variant: nextEnabled ? 'success' : 'warning',
    })

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await api.updateUser(user.id, { enabled: nextEnabled })
      setSuccess(nextEnabled ? 'User enabled successfully.' : 'User disabled successfully.')
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (user) => {
    const confirmed = await confirm({
      title: 'Delete user?',
      message: `Permanently remove ${user.name} (${user.email})? This action cannot be undone.`,
      confirmLabel: 'Delete User',
      variant: 'danger',
    })

    if (!confirmed) {
      return
    }

    try {
      await api.deleteUser(user.id)
      loadUsers()
      if (editingId === user.id) resetForm()
      setSuccess('User deleted successfully.')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <p>Create and manage mobile app users</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit User' : 'Add User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="field">
              <label>{editingId ? 'New Password (optional)' : 'Password'}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingId}
              />
            </div>
            <div className="field">
              <label>Mobile</label>
              <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div className="field">
              <label>Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="field">
              <label>Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {editingId ? 'Update User' : 'Create User'}
            </button>
            {editingId ? (
              <button className="btn btn-danger" type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>
      </div>

      <div className="card table-wrap">
        <h3 style={{ marginTop: 0 }}>All Users</h3>
        {users.length === 0 ? (
          <p className="empty-state">No users yet. Create one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Company</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile || '-'}</td>
                  <td>{user.role || '-'}</td>
                  <td>{user.company || '-'}</td>
                  <td>
                    <span
                      className={`status-badge ${user.enabled === true ? 'status-enabled' : 'status-disabled'}`}
                    >
                      {user.enabled === true ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className={`btn ${user.enabled === true ? 'btn-warning' : 'btn-primary'}`}
                      type="button"
                      onClick={() => handleToggleEnabled(user)}
                    >
                      {user.enabled === true ? 'Disable' : 'Enable'}
                    </button>
                    <button className="btn btn-primary" type="button" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => handleDelete(user)}>
                      Delete
                    </button>
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
