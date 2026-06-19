import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'Users',
  '/dashboard/leads': 'Leads',
  '/dashboard/upload': 'Upload Excel',
  '/dashboard/user-leads': 'User Leads',
  '/dashboard/settings': 'Settings',
  '/dashboard/audit': 'Audit Log',
}

export function AdminTopBar() {
  const location = useLocation()
  const { admin } = useAuth()
  const title = PAGE_TITLES[location.pathname] || 'Admin'

  return (
    <header className="admin-topbar">
      <div>
        <p className="admin-topbar-eyebrow">Lead List Admin</p>
        <h2 className="admin-topbar-title">{title}</h2>
      </div>
      <div className="admin-topbar-user">
        <span className="admin-topbar-avatar">{admin?.email?.charAt(0).toUpperCase() || 'A'}</span>
        <span className="admin-topbar-email">{admin?.email}</span>
      </div>
    </header>
  )
}
