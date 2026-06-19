import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { api } from '../services'
import { AdminFormPanel } from '../components/AdminFormPanel'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { useAdminAccess } from '../hooks/useAdminAccess'
import { getAdminRoleLabel, resolveAdminRole } from '../utils/adminRoles'

const EMPTY_FORM = { name: '', email: '', password: '', confirmPassword: '', role: 'admin' }

export function SettingsPage() {
  const confirm = useConfirm()
  const { admin: currentAdmin } = useAuth()
  const { canWrite, isSuperAdmin } = useAdminAccess()
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [panelOpen, setPanelOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const loadAdmins = () => {
    api.getAdmins().then(setAdmins).catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const closePanel = () => {
    if (loading) return
    setPanelOpen(false)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await api.createAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })
      setSuccess('Admin added successfully.')
      closePanel()
      loadAdmins()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (admin) => {
    const confirmed = await confirm({
      title: 'Remove admin?',
      message: `Remove admin access for ${admin.name} (${admin.email})?`,
      confirmLabel: 'Remove Admin',
      variant: 'danger',
    })
    if (!confirmed) return

    try {
      await api.deleteAdmin(admin.id)
      setSuccess('Admin removed successfully.')
      loadAdmins()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box>
      <PageHeader
        subtitle="Manage admin accounts and panel access"
        actionLabel={canWrite ? 'Add Admin' : undefined}
        actionIcon={canWrite ? <AddIcon /> : undefined}
        onAction={canWrite ? () => { setForm(EMPTY_FORM); setError(''); setPanelOpen(true) } : undefined}
      />

      {error && !panelOpen ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert> : null}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Access</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Added</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id} hover>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={getAdminRoleLabel(resolveAdminRole(admin))}
                      color={resolveAdminRole(admin) === 'super_admin' ? 'primary' : 'default'}
                      size="small"
                      variant={resolveAdminRole(admin) === 'super_admin' ? 'filled' : 'outlined'}
                    />
                    {admin.isPrimary ? (
                      <Chip label="Primary" color="success" size="small" variant="filled" />
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell align="right">
                  {admin.isPrimary ? (
                    <Typography variant="caption" color="text.secondary">Protected</Typography>
                  ) : currentAdmin?.id === admin.id ? (
                    <Typography variant="caption" color="text.secondary">You</Typography>
                  ) : canWrite ? (
                    <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(admin)}>
                      Delete
                    </Button>
                  ) : (
                    <Typography variant="caption" color="text.secondary">View only</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AdminFormPanel
        open={panelOpen}
        form={form}
        loading={loading}
        error={error}
        onChange={(updates) => setForm((c) => ({ ...c, ...updates }))}
        onSubmit={handleSubmit}
        onClose={closePanel}
        showRoleField={isSuperAdmin}
      />
    </Box>
  )
}
