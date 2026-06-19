import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import './AdminSidebar.css'

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: '▣' }],
  },
  {
    title: 'Management',
    items: [
      { to: '/dashboard/users', label: 'Users', icon: '👤' },
      { to: '/dashboard/leads', label: 'Leads', icon: '☰' },
      { to: '/dashboard/upload', label: 'Upload Excel', icon: '⇪' },
      { to: '/dashboard/user-leads', label: 'User Leads', icon: '📊' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/dashboard/audit', label: 'Audit Log', icon: '📋' },
      { to: '/dashboard/settings', label: 'Settings', icon: '⚙' },
    ],
  },
]

export function AdminSidebar() {
  const { admin, logout } = useAuth()
  const confirm = useConfirm()

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Sign out?',
      message: 'Are you sure you want to sign out of the admin panel?',
      confirmLabel: 'Sign Out',
      cancelLabel: 'Cancel',
      variant: 'warning',
    })

    if (confirmed) {
      logout()
    }
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-icon">LL</span>
        <div>
          <h1>Lead List</h1>
          <p>Admin Panel</p>
        </div>
      </div>

      <nav className="admin-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="admin-nav-section">
            <p className="admin-nav-section-title">{section.title}</p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-card">
          <span className="admin-user-avatar">{admin?.email?.charAt(0).toUpperCase() || 'A'}</span>
          <div>
            <p className="admin-user-label">Signed in as</p>
            <p className="admin-user-email">{admin?.email}</p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost admin-signout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
