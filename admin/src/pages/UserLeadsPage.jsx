import { useEffect, useState } from 'react'
import { api } from '../services'
import { LEAD_STATUSES, STATUS_COLORS } from '../constants/leadStatuses'

export function UserLeadsPage() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState('')

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
    if (!userId) {
      setLeads([])
      return
    }

    setLoading(true)
    setError('')

    api
      .getLeads(userId)
      .then(setLeads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  const selectedUser = users.find((user) => user.id === userId)

  const handleDownload = async (type) => {
    if (!selectedUser) {
      return
    }

    setDownloading(type)
    setError('')

    try {
      if (type === 'excel') {
        await api.downloadUserLeadsExcel(selectedUser.id, selectedUser.name)
      } else {
        await api.downloadUserLeadsPdf(selectedUser.id, selectedUser.name)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setDownloading('')
    }
  }

  return (
    <div>
      <div className="page-header">
        <p>View a user&apos;s lead list and download it as Excel or PDF.</p>
      </div>

      <div className="toolbar">
        <div className="field" style={{ margin: 0, minWidth: 280 }}>
          <label htmlFor="view-user">Select user</label>
          <select id="view-user" value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!userId || downloading === 'excel'}
            onClick={() => handleDownload('excel')}
          >
            {downloading === 'excel' ? 'Downloading...' : 'Download Excel'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!userId || downloading === 'pdf'}
            onClick={() => handleDownload('pdf')}
          >
            {downloading === 'pdf' ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {selectedUser ? (
        <p style={{ color: '#6b7280', margin: '0 0 16px' }}>
          Showing {leads.length} lead(s) for <strong>{selectedUser.name}</strong>
        </p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      <div className="card table-wrap">
        {loading ? (
          <p className="empty-state">Loading leads...</p>
        ) : !userId ? (
          <p className="empty-state">Select a user to view their lead list.</p>
        ) : leads.length === 0 ? (
          <p className="empty-state">No leads found for this user. Upload an Excel file first.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Follow Up</th>
                <th>Rejection Reason</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email || '—'}</td>
                  <td>{lead.phone || '—'}</td>
                  <td>{lead.company || '—'}</td>
                  <td>{lead.role || '—'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${STATUS_COLORS[lead.status] || '#6b7280'}22`,
                        color: STATUS_COLORS[lead.status] || '#6b7280',
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.followUpDate || '—'}</td>
                  <td>{lead.rejectionReason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {leads.length > 0 ? (
        <p style={{ color: '#6b7280', marginTop: 16 }}>
          Status options: {LEAD_STATUSES.join(', ')}
        </p>
      ) : null}
    </div>
  )
}
