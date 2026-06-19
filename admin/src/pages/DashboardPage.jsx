import { useEffect, useState } from 'react'
import { api } from '../services'
import { LEAD_STATUSES, STATUS_COLORS } from '../constants/leadStatuses'

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <div className="page-header">
        <p>Overview of users and leads in the system</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {stats ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
              <h3>Total Leads</h3>
              <p>{stats.totalLeads}</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Leads by Status</h3>
            {LEAD_STATUSES.map((status) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span
                  className="status-badge"
                  style={{ background: `${STATUS_COLORS[status]}22`, color: STATUS_COLORS[status] }}
                >
                  {status}
                </span>
                <strong>{stats.statusCounts[status] || 0}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        !error && <p>Loading dashboard...</p>
      )}
    </div>
  )
}
