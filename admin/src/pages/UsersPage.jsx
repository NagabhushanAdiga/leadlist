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
} from '@mui/material'
import { api } from '../services'
import { UserFormPanel } from '../components/UserFormPanel'
import { NameAvatarCell } from '../components/NameAvatarCell'
import { PageHeader } from '../components/PageHeader'
import { useConfirm } from '../context/ConfirmContext'
import { useAdminAccess } from '../hooks/useAdminAccess'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  role: 'Sales Executive',
  company: '',
}

export function UsersPage() {
  const confirm = useConfirm()
  const { canWrite } = useAdminAccess()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const loadUsers = () => {
    api.getUsers().then(setUsers).catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const closePanel = () => {
    if (loading) return
    setPanelOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  const openAddPanel = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
    setPanelOpen(true)
  }

  const openEditPanel = (user) => {
    setEditingId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      mobile: user.mobile || '',
      role: user.role || '',
      company: user.company || '',
    })
    setError('')
    setPanelOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (editingId) {
        await api.updateUser(editingId, form)
        setSuccess('User updated successfully.')
      } else {
        await api.createUser(form)
        setSuccess('User created successfully.')
      }
      closePanel()
      loadUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEnabled = async (user) => {
    const nextEnabled = user.enabled !== true
    const confirmed = await confirm({
      title: nextEnabled ? 'Enable user?' : 'Disable user?',
      message: nextEnabled
        ? `Allow ${user.name} (${user.email}) to access the mobile app?`
        : `Block ${user.name} (${user.email}) from accessing app pages?`,
      confirmLabel: nextEnabled ? 'Enable User' : 'Disable User',
      variant: nextEnabled ? 'success' : 'warning',
    })
    if (!confirmed) return

    try {
      await api.updateUser(user.id, { enabled: nextEnabled })
      setSuccess(nextEnabled ? 'User enabled.' : 'User disabled.')
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (user) => {
    const confirmed = await confirm({
      title: 'Delete user?',
      message: `Permanently remove ${user.name} (${user.email})?`,
      confirmLabel: 'Delete User',
      variant: 'danger',
    })
    if (!confirmed) return

    try {
      await api.deleteUser(user.id)
      if (editingId === user.id) closePanel()
      setSuccess('User deleted successfully.')
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box>
      <PageHeader
        subtitle="Create and manage mobile app users"
        actionLabel={canWrite ? 'Add User' : undefined}
        actionIcon={canWrite ? <AddIcon /> : undefined}
        onAction={canWrite ? openAddPanel : undefined}
      />

      {error && !panelOpen ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert> : null}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Mobile</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Role</TableCell>
              <TableCell>Status</TableCell>
              {canWrite ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canWrite ? 5 : 4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No users yet. Click Add User to create one.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <NameAvatarCell name={user.name} email={user.email} />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.mobile || '—'}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.role || '—'}</TableCell>
                  <TableCell>
                    <Chip label={user.enabled ? 'Enabled' : 'Disabled'} color={user.enabled ? 'success' : 'default'} size="small" />
                  </TableCell>
                  {canWrite ? (
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                        <Button size="small" variant="outlined" onClick={() => handleToggleEnabled(user)}>
                          {user.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button size="small" variant="contained" onClick={() => openEditPanel(user)}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(user)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UserFormPanel
        open={panelOpen}
        isEditing={Boolean(editingId)}
        form={form}
        loading={loading}
        error={error}
        onChange={(updates) => setForm((c) => ({ ...c, ...updates }))}
        onSubmit={handleSubmit}
        onClose={closePanel}
      />
    </Box>
  )
}
