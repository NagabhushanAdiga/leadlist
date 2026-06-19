import { useEffect, useState } from 'react'
import { api } from '../services'

function formatDate(value) {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function UploadPage() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [historyUserId, setHistoryUserId] = useState('All')
  const [uploads, setUploads] = useState([])
  const [uploadsTotal, setUploadsTotal] = useState(0)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUploads = async (selectedUserId = historyUserId) => {
    setHistoryLoading(true)

    try {
      const data = await api.getExcelUploads({
        userId: selectedUserId,
        limit: 50,
      })
      setUploads(data.items)
      setUploadsTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    api
      .getUsers()
      .then((data) => {
        setUsers(data)
        if (data.length > 0) {
          setUserId(data[0].id)
        }
      })
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    loadUploads(historyUserId)
  }, [historyUserId])

  const selectedUser = users.find((user) => user.id === userId)

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
      setSuccess(
        `Imported ${result.count} leads for ${result.userName} from ${result.fileName || file.name}.`,
      )
      setFile(null)
      event.target.reset()
      loadUploads(historyUserId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <p>Upload Excel files for a specific user. Each import replaces only that user&apos;s lead list.</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Import Excel for User</h3>
        <form onSubmit={handleUpload}>
          <p style={{ color: '#6b7280', marginTop: 0 }}>
            Expected columns: <strong>Name, Email, Phone, Company, Role, Status (optional)</strong>
          </p>

          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="import-user">Select user</label>
            <select
              id="import-user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}){user.enabled === true ? '' : ' — disabled'}
                </option>
              ))}
            </select>
          </div>

          {selectedUser ? (
            <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 16 }}>
              Leads will be assigned to <strong>{selectedUser.name}</strong> ({selectedUser.email}).
            </p>
          ) : null}

          {users.length === 0 ? (
            <p className="error-text" style={{ marginBottom: 16 }}>
              No users available. Create a user first before importing leads.
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

          <button className="btn btn-primary" type="submit" disabled={loading || users.length === 0}>
            {loading ? 'Importing...' : 'Import Leads for User'}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>
      </div>

      <div className="card table-wrap">
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <h3 style={{ margin: 0 }}>Upload History by User</h3>
          <div className="field" style={{ margin: 0, minWidth: 240 }}>
            <label htmlFor="history-user">Filter by user</label>
            <select
              id="history-user"
              value={historyUserId}
              onChange={(e) => setHistoryUserId(e.target.value)}
            >
              <option value="All">All users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <p style={{ color: '#6b7280', margin: '12px 0 16px' }}>{uploadsTotal} upload(s)</p>

        {historyLoading ? (
          <p className="empty-state">Loading upload history...</p>
        ) : uploads.length === 0 ? (
          <p className="empty-state">No Excel uploads yet for this user.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>User</th>
                <th>File</th>
                <th>Leads</th>
                <th>Uploaded by</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td>{formatDate(upload.createdAt)}</td>
                  <td>
                    <strong>{upload.userName}</strong>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{upload.userEmail}</span>
                  </td>
                  <td>{upload.fileName}</td>
                  <td>{upload.leadCount}</td>
                  <td>
                    <strong>{upload.uploadedByName}</strong>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                      {upload.uploadedByEmail} ({upload.uploadedByType})
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: upload.source === 'admin' ? '#eef0ff' : '#ecfdf5',
                        color: upload.source === 'admin' ? '#6c63ff' : '#047857',
                      }}
                    >
                      {upload.source === 'admin' ? 'Admin panel' : 'Mobile app'}
                    </span>
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
