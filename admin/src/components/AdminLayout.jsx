import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  Alert,
  AppBar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { AdminSidebar, DRAWER_WIDTH } from './AdminSidebar'
import { useAdminAccess } from '../hooks/useAdminAccess'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'Users',
  '/dashboard/leads': 'Leads',
  '/dashboard/upload': 'Upload Excel',
  '/dashboard/user-leads': 'User Leads',
  '/dashboard/settings': 'Settings',
  '/dashboard/audit': 'Audit Log',
  '/dashboard/feedback': 'Feedback',
  '/dashboard/do-not-enter': 'Do not Enter',
}

export function AdminLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isReadOnly, roleLabel } = useAdminAccess()
  const title = PAGE_TITLES[location.pathname] || 'Admin'

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>
              LEAD LIST ADMIN
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Chip label={roleLabel} size="small" color={isReadOnly ? 'default' : 'primary'} sx={{ fontWeight: 700 }} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          p: { xs: 2, sm: 3 },
          pt: { xs: 10, sm: 11 },
          bgcolor: '#ffffff',
        }}
      >
        {isReadOnly ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            You are signed in as an Admin with read-only access. You can view all data but cannot create, update, export, or delete anything.
          </Alert>
        ) : null}
        <Outlet />
      </Box>
    </Box>
  )
}
