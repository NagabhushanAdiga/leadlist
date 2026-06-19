import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import ListAltIcon from '@mui/icons-material/ListAlt'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import TableChartIcon from '@mui/icons-material/TableChart'
import HistoryIcon from '@mui/icons-material/History'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import FeedbackIcon from '@mui/icons-material/FeedbackOutlined'
import DangerousIcon from '@mui/icons-material/DangerousOutlined'
import BlockIcon from '@mui/icons-material/BlockOutlined'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InboxIcon from '@mui/icons-material/InboxOutlined'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { useAdminAccess } from '../hooks/useAdminAccess'

export const DRAWER_WIDTH = 260

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: DashboardIcon, end: true }],
  },
  {
    title: 'Management',
    items: [
      { to: '/dashboard/users', label: 'Users', icon: PeopleIcon },
      { to: '/dashboard/leads', label: 'Leads', icon: ListAltIcon },
      { to: '/dashboard/upload', label: 'Upload Excel', icon: UploadFileIcon },
      { to: '/dashboard/user-leads', label: 'User Leads', icon: TableChartIcon },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        label: 'Feedback',
        icon: FeedbackIcon,
        children: [{ to: '/dashboard/feedback', label: 'All feedback', icon: InboxIcon, end: true }],
      },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/dashboard/audit', label: 'Audit Log', icon: HistoryIcon },
      { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
  {
    title: 'Do not Enter',
    items: [
      {
        label: 'Do not Enter',
        icon: DangerousIcon,
        children: [
          {
            to: '/dashboard/do-not-enter',
            label: 'Database wipe',
            icon: BlockIcon,
            end: true,
          },
        ],
      },
    ],
  },
]

function NavItem({ item, location, onNavigate, expandedMenus, toggleMenu }) {
  const Icon = item.icon

  if (item.children) {
    const isOpen = expandedMenus[item.label] ?? item.children.some((child) =>
      child.end ? location.pathname === child.to : location.pathname.startsWith(child.to),
    )
    const isActive = item.children.some((child) =>
      child.end ? location.pathname === child.to : location.pathname.startsWith(child.to),
    )

    return (
      <Box>
        <ListItemButton
          onClick={() => toggleMenu(item.label)}
          selected={isActive}
          sx={{
            borderRadius: 0.5,
            mb: 0.5,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
              '&:hover': { bgcolor: 'primary.dark' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
          {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List dense disablePadding sx={{ pl: 1.5 }}>
            {item.children.map((child) => {
              const ChildIcon = child.icon
              const childActive = child.end
                ? location.pathname === child.to
                : location.pathname.startsWith(child.to)

              return (
                <ListItemButton
                  key={child.to}
                  component={NavLink}
                  to={child.to}
                  end={child.end}
                  onClick={onNavigate}
                  selected={childActive}
                  sx={{
                    borderRadius: 0.5,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(108, 99, 255, 0.12)',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChildIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={child.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.88rem' }} />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      </Box>
    )
  }

  const isActive = item.end
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to)

  return (
    <ListItemButton
      component={NavLink}
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      selected={isActive}
      sx={{
        borderRadius: 0.5,
        mb: 0.5,
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
          '&:hover': { bgcolor: 'primary.dark' },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
    </ListItemButton>
  )
}

function DrawerContent({ onNavigate }) {
  const { admin, logout } = useAuth()
  const { isSuperAdmin } = useAdminAccess()
  const confirm = useConfirm()
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({ Feedback: true, 'Do not Enter': false })

  const navSections = NAV_SECTIONS.filter((section) =>
    section.title === 'Do not Enter' ? isSuperAdmin : true,
  )

  const toggleMenu = (label) => {
    setExpandedMenus((current) => ({ ...current, [label]: !current[label] }))
  }

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>LL</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Lead List
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {navSections.map((section) => (
          <Box key={section.title} sx={{ px: 1.5, py: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                display: 'block',
                color: section.title === 'Do not Enter' ? '#dc2626' : 'text.secondary',
                fontWeight: 700,
                letterSpacing: 0.8,
              }}
            >
              {section.title.toUpperCase()}
            </Typography>
            <List dense disablePadding>
              {section.items.map((item) => (
                <NavItem
                  key={item.to || item.label}
                  item={item}
                  location={location}
                  onNavigate={onNavigate}
                  expandedMenus={expandedMenus}
                  toggleMenu={toggleMenu}
                />
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light' }}>
            {admin?.email?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body2" fontWeight={600} noWrap>
              {admin?.email}
            </Typography>
          </Box>
        </Box>
        <Button fullWidth variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Sign Out
        </Button>
      </Box>
    </Box>
  )
}

export function AdminSidebar({ mobileOpen, onClose, variant }) {
  return (
    <Drawer
      variant={variant}
      open={variant === 'temporary' ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerContent onNavigate={onClose} />
    </Drawer>
  )
}
