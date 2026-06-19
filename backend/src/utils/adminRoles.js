export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
}

export function resolveAdminRole(admin) {
  if (!admin) {
    return ADMIN_ROLES.ADMIN
  }

  if (admin.role === ADMIN_ROLES.SUPER_ADMIN) {
    return ADMIN_ROLES.SUPER_ADMIN
  }

  if (admin.isPrimary) {
    return ADMIN_ROLES.SUPER_ADMIN
  }

  return ADMIN_ROLES.ADMIN
}

export function isSuperAdminRole(admin) {
  return resolveAdminRole(admin) === ADMIN_ROLES.SUPER_ADMIN
}
