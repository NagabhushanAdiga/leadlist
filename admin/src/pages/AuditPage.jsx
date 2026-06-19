import { useEffect, useState } from 'react'
import { api } from '../services'

const ENTITY_TYPES = ['All', 'user', 'lead', 'admin', 'profile', 'password']
const ACTIONS = ['All', 'create', 'update', 'delete', 'import']
const ACTOR_TYPES = ['All', 'admin', 'user']

function formatDate(value) {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatChangeValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}

function actionLabel(action) {
  return action.charAt(0).toUpperCase() + action.slice(1)
}

function entityLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function AuditPage() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [entityType, setEntityType] = useState('All')
  const [action, setAction] = useState('All')
  const [actorType, setActorType] = useState('All')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadLogs = async (nextPage = page) => {
    setLoading(true)
    setError('')

    try {
      const data = await api.getAuditLogs({
        page: nextPage,
        limit: 25,
        entityType,
        action,
        actorType,
      })

      setLogs(data.items)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs(1)
  }, [entityType, action, actorType])

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return
    }

    loadLogs(nextPage)
  }

  return (
    <div>
      <div className="page-header">
        <p>Track who changed what and when across users, leads, and settings</p>
      </div>

      <div className="toolbar">
        <div className="field" style={{ margin: 0, minWidth: 180 }}>
          <label>Entity</label>
          <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
            {ENTITY_TYPES.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All entities' : entityLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ margin: 0, minWidth: 160 }}>
          <label>Action</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            {ACTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All actions' : actionLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ margin: 0, minWidth: 160 }}>
          <label>Updated by</label>
          <select value={actorType} onChange={(e) => setActorType(e.target.value)}>
            {ACTOR_TYPES.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'Everyone' : entityLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <p style={{ margin: 0, color: '#6b7280' }}>{total} event(s)</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="card table-wrap">
        {loading ? (
          <p className="empty-state">Loading audit log...</p>
        ) : logs.length === 0 ? (
          <p className="empty-state">No audit events yet. Changes will appear here automatically.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Summary</th>
                <th>What changed</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.createdAt)}</td>
                  <td>
                    <strong>{entry.actorName}</strong>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                      {entry.actorEmail} ({entry.actorType})
                    </span>
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: '#eef0ff', color: '#6c63ff' }}>
                      {actionLabel(entry.action)}
                    </span>
                  </td>
                  <td>
                    <strong>{entityLabel(entry.entityType)}</strong>
                    {entry.entityLabel ? (
                      <>
                        <br />
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{entry.entityLabel}</span>
                      </>
                    ) : null}
                  </td>
                  <td>{entry.summary}</td>
                  <td>
                    {entry.changes?.length ? (
                      <ul className="audit-changes-list">
                        {entry.changes.map((change) => (
                          <li key={`${entry.id}-${change.field}`}>
                            <strong>{change.field}:</strong>{' '}
                            {formatChangeValue(change.from)} → {formatChangeValue(change.to)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn"
            style={{ background: '#eef0ff', color: '#6c63ff' }}
            disabled={page <= 1 || loading}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
          <span style={{ color: '#6b7280' }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn"
            style={{ background: '#eef0ff', color: '#6c63ff' }}
            disabled={page >= totalPages || loading}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}
