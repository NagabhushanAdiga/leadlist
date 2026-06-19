import { useEffect, useState } from 'react'
import { api } from '../services'
import { LEAD_STATUSES, STATUS_COLORS } from '../constants/leadStatuses'

export function LeadsPage() {
  const [users, setUsers] = useState([])
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [userFilter, setUserFilter] = useState('All')

  const loadLeads = (selectedUserId = userFilter) => {
    const userId = selectedUserId === 'All' ? undefined : selectedUserId
    api.getLeads(userId).then(setLeads).catch((err) => setError(err.message))
  }

  useEffect(() => {
    api.getUsers().then(setUsers).catch((err) => setError(err.message))
    loadLeads()
  }, [])

  const handleUserFilterChange = (value) => {
    setUserFilter(value)
    loadLeads(value)
  }

  const handleStatusChange = async (lead, status) => {
    try {
      await api.updateLead(lead.id, { ...lead, status })
      loadLeads()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return

    try {
      await api.deleteLead(id)
      loadLeads()
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredLeads =
    filter === 'All' ? leads : leads.filter((lead) => lead.status === filter)

  return (
    <div>
      <div className="page-header">
        <p>View and manage leads by user</p>
      </div>

      <div className="toolbar">
        <div className="field" style={{ margin: 0, minWidth: 220 }}>
          <label>Filter by user</label>
          <select value={userFilter} onChange={(e) => handleUserFilterChange(e.target.value)}>
            <option value="All">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ margin: 0, minWidth: 220 }}>
          <label>Filter by status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <p style={{ margin: 0, color: '#6b7280' }}>{filteredLeads.length} lead(s)</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="card table-wrap">
        {filteredLeads.length === 0 ? (
          <p className="empty-state">No leads found. Upload an Excel file to import leads.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.userName || '-'}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email || '-'}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>{lead.company || '-'}</td>
                  <td>{lead.role || '-'}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead, e.target.value)}
                      style={{
                        borderColor: STATUS_COLORS[lead.status],
                        color: STATUS_COLORS[lead.status],
                        fontWeight: 600,
                      }}
                    >
                      {LEAD_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-danger" type="button" onClick={() => handleDelete(lead.id)}>
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
