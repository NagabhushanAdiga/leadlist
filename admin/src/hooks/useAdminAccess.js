import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { ADMIN_ROLES, getAdminRoleLabel, isSuperAdmin, resolveAdminRole } from '../utils/adminRoles'

export function useAdminAccess() {
  const { admin } = useAuth()

  return useMemo(() => {
    const role = resolveAdminRole(admin)
    const superAdmin = isSuperAdmin(admin)

    return {
      admin,
      role,
      roleLabel: getAdminRoleLabel(role),
      isSuperAdmin: superAdmin,
      canWrite: superAdmin,
      isReadOnly: !superAdmin,
    }
  }, [admin])
}

export { ADMIN_ROLES }
