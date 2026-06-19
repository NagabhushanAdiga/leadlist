import { Navigate } from 'react-router-dom'
import { useAdminAccess } from '../hooks/useAdminAccess'

export function SuperAdminRoute({ children }) {
  const { isSuperAdmin } = useAdminAccess()

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
