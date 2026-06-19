import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopBar } from './AdminTopBar'
import './AdminLayout.css'

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-content-area">
        <AdminTopBar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
