import { useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmberOutlined'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { api } from '../services'
import { PageHeader } from '../components/PageHeader'
import { useConfirm } from '../context/ConfirmContext'

const PURGE_ACTIONS = [
  {
    id: 'excel',
    title: 'Delete all Excel data',
    description: 'Removes every Excel upload record and all leads in the system.',
    buttonLabel: 'Delete Excel & Leads',
    run: () => api.purgeExcelData(),
    success: (result) =>
      `Removed ${result.deletedUploads} upload(s) and ${result.deletedLeads} lead(s).`,
  },
  {
    id: 'leads',
    title: 'Delete all leads',
    description: 'Removes every lead from all users. Excel upload history stays.',
    buttonLabel: 'Delete All Leads',
    run: () => api.purgeAllLeads(),
    success: (result) => `Removed ${result.deletedLeads} lead(s).`,
  },
  {
    id: 'users',
    title: 'Delete all users',
    description: 'Removes all mobile users plus their leads, Excel uploads, and sessions.',
    buttonLabel: 'Delete All Users',
    run: () => api.purgeAllUsers(),
    success: (result) =>
      `Removed ${result.deletedUsers} user(s), ${result.deletedLeads} lead(s), and ${result.deletedUploads} upload(s).`,
  },
  {
    id: 'admins',
    title: 'Delete all admins',
    description: 'Removes every admin account except the protected primary admin.',
    buttonLabel: 'Delete All Admins',
    run: () => api.purgeAllAdmins(),
    success: (result) =>
      result.message ||
      `Removed ${result.deletedAdmins} admin account(s) and ${result.deletedSessions} session(s).`,
  },
  {
    id: 'audit',
    title: 'Delete all audit logs',
    description: 'Permanently clears the full activity and audit history.',
    buttonLabel: 'Delete Audit Logs',
    run: () => api.purgeAllAuditLogs(),
    success: (result) => `Removed ${result.deletedLogs} audit log(s).`,
  },
  {
    id: 'feedback',
    title: 'Delete all feedback',
    description: 'Removes every feedback message submitted from the mobile app.',
    buttonLabel: 'Delete All Feedback',
    run: () => api.purgeAllFeedback(),
    success: (result) => `Removed ${result.deletedFeedback} feedback item(s).`,
  },
]

export function DoNotEnterPage() {
  const confirm = useConfirm()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loadingId, setLoadingId] = useState('')
  const [wipeConfirm, setWipeConfirm] = useState('')
  const [wipeDialogOpen, setWipeDialogOpen] = useState(false)

  const runAction = async (action) => {
    const confirmed = await confirm({
      title: action.title,
      message: `${action.description} This action cannot be undone.`,
      confirmLabel: action.buttonLabel,
      cancelLabel: 'Cancel',
      variant: 'danger',
    })

    if (!confirmed) return

    setError('')
    setSuccess('')
    setLoadingId(action.id)

    try {
      const result = await action.run()
      setSuccess(action.success(result))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingId('')
    }
  }

  const handleWipeEverything = async () => {
    if (wipeConfirm.trim().toUpperCase() !== 'DELETE') {
      setError('Type DELETE in the confirmation box to wipe the database.')
      return
    }

    const confirmed = await confirm({
      title: 'Wipe entire database?',
      message:
        'This will delete all users, leads, Excel uploads, feedback, audit logs, and non-primary admin accounts. The primary admin will be kept so you can still sign in.',
      confirmLabel: 'Wipe Everything',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })

    if (!confirmed) return

    setError('')
    setSuccess('')
    setLoadingId('all')

    try {
      const result = await api.purgeEntireDatabase()
      setSuccess(result.message || 'Database wiped successfully.')
      setWipeConfirm('')
      setWipeDialogOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Box>
      <PageHeader subtitle="Destructive actions. Proceed only if you know exactly what you are doing." />

      <Card
        sx={{
          mb: 3,
          border: '1px solid #fecaca',
          bgcolor: '#fff5f5',
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <WarningAmberIcon sx={{ color: '#dc2626', mt: 0.25 }} />
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#991b1b', mb: 0.5 }}>
                Do not enter unless you mean it
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d', lineHeight: 1.7 }}>
                These tools permanently delete production data. There is no undo, no recycle bin, and no automatic backup.
                The primary admin account is always protected.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert> : null}

      <Stack spacing={2}>
        {PURGE_ACTIONS.map((action) => (
          <Card key={action.id} variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ md: 'center' }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
                    {action.description}
                  </Typography>
                </Box>
                <Button
                  color="error"
                  variant="outlined"
                  disabled={Boolean(loadingId)}
                  onClick={() => runAction(action)}
                >
                  {loadingId === action.id ? 'Deleting...' : action.buttonLabel}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        <Card
          sx={{
            border: '2px solid #dc2626',
            bgcolor: '#fef2f2',
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <DeleteForeverIcon sx={{ color: '#dc2626' }} />
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#991b1b' }}>
                    Wipe entire database
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f1d1d', lineHeight: 1.7 }}>
                  Deletes users, leads, Excel uploads, feedback, audit logs, and all non-primary admins in one action.
                  Only the primary admin account remains.
                </Typography>
              </Box>

              {!wipeDialogOpen ? (
                <Button
                  color="error"
                  variant="contained"
                  startIcon={<DeleteForeverIcon />}
                  disabled={Boolean(loadingId)}
                  onClick={() => {
                    setError('')
                    setWipeDialogOpen(true)
                  }}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Open full wipe controls
                </Button>
              ) : (
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                    Type DELETE to confirm
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField
                      size="small"
                      placeholder="DELETE"
                      value={wipeConfirm}
                      onChange={(e) => setWipeConfirm(e.target.value)}
                      sx={{ minWidth: 220, bgcolor: '#fff' }}
                    />
                    <Button
                      color="error"
                      variant="contained"
                      disabled={loadingId === 'all'}
                      onClick={handleWipeEverything}
                    >
                      {loadingId === 'all' ? 'Wiping...' : 'Wipe Everything'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        setWipeDialogOpen(false)
                        setWipeConfirm('')
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}
