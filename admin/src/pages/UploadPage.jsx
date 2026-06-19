import { useEffect, useState } from 'react'
import { api } from '../api/client'

export function UploadPage() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api
      .getUsers()
      .then((data) => {
        setUsers(data)
        const firstEnabled = data.find((user) => user.enabled)
        if (firstEnabled) {
          setUserId(firstEnabled.id)
        }
      })
      .catch((err) => setError(err.message))
  }, [])

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!userId) {
      setError('Select a user to import leads for.')
      return
    }

    if (!file) {
      setError('Please select an Excel file.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await api.importLeads(file, userId)
      setSuccess(`Imported ${result.count} leads for ${result.userName}.`)
      setFile(null)
      event.target.reset()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const enabledUsers = users.filter((user) => user.enabled)

  return (
    <div>
      <div className="page-header">
        <p>Import leads for a specific user. Each upload only replaces that user&apos;s lead list.</p>
      </div>

      <div className="card">
        <form onSubmit={handleUpload}>
          <p style={{ color: '#6b7280', marginTop: 0 }}>
            Expected columns: <strong>Name, Email, Phone, Company, Role, Status (optional)</strong>
          </p>

          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="import-user">Import for user</label>
            <select
              id="import-user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {enabledUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {enabledUsers.length === 0 ? (
            <p className="error-text" style={{ marginBottom: 16 }}>
              No active users available. Enable a user account before importing leads.
            </p>
          ) : null}

          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="excel-file">Excel file (.xlsx, .xls)</label>
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || enabledUsers.length === 0}
          >
            {loading ? 'Importing...' : 'Import Leads'}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>
      </div>
    </div>
  )
}
