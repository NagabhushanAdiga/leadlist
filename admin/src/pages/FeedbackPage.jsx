import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { api } from '../services'
import { NameAvatarCell } from '../components/NameAvatarCell'
import { PageHeader } from '../components/PageHeader'
import { buildLabelOptions, SearchableSelect } from '../components/SearchableSelect'
import { useConfirm } from '../context/ConfirmContext'
import { useAdminAccess } from '../hooks/useAdminAccess'

const STATUSES = ['All', 'new', 'reviewed', 'resolved']
const CATEGORIES = ['All', 'bug', 'feature', 'general', 'other']

const STATUS_OPTIONS = buildLabelOptions(STATUSES, {
  formatLabel: (value) => (value === 'All' ? 'All statuses' : value.charAt(0).toUpperCase() + value.slice(1)),
})
const CATEGORY_OPTIONS = buildLabelOptions(CATEGORIES, {
  formatLabel: (value) => (value === 'All' ? 'All categories' : value.charAt(0).toUpperCase() + value.slice(1)),
})

const STATUS_COLORS = {
  new: { bg: '#eef0ff', color: '#6c63ff' },
  reviewed: { bg: '#eff8ff', color: '#0ea5e9' },
  resolved: { bg: '#ecfdf5', color: '#10b981' },
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function FeedbackPage() {
  const confirm = useConfirm()
  const { canWrite } = useAdminAccess()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selected, setSelected] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [editStatus, setEditStatus] = useState('new')
  const [saving, setSaving] = useState(false)

  const loadFeedback = async (nextPage = page) => {
    setLoading(true)
    setError('')

    try {
      const data = await api.getFeedback({ page: nextPage, limit: 20, status, category, search })
      setItems(data.items)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedback(1)
  }, [status, category])

  const openDetails = (item) => {
    setSelected(item)
    setAdminNote(item.adminNote || '')
    setEditStatus(item.status)
  }

  const handleSave = async () => {
    if (!selected) return

    setSaving(true)
    setError('')

    try {
      await api.updateFeedback(selected.id, { status: editStatus, adminNote })
      setSuccess('Feedback updated.')
      setSelected(null)
      loadFeedback(page)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const confirmed = await confirm({
      title: 'Delete feedback?',
      message: `Delete feedback from ${item.userName}?`,
      confirmLabel: 'Delete',
      variant: 'danger',
    })

    if (!confirmed) return

    try {
      await api.deleteFeedback(item.id)
      setSuccess('Feedback deleted.')
      loadFeedback(page)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box>
      <PageHeader subtitle="Review feedback submitted by mobile app users" />

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert> : null}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <SearchableSelect label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} minWidth={200} />
          <SearchableSelect label="Category" value={category} onChange={setCategory} options={CATEGORY_OPTIONS} minWidth={200} />
          <TextField
            size="small"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadFeedback(1)}
            sx={{ flex: 1, minWidth: 220 }}
          />
          <Button variant="contained" onClick={() => loadFeedback(1)}>Apply</Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {total} feedback item{total === 1 ? '' : 's'}
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                {canWrite ? <TableCell align="right">Actions</TableCell> : <TableCell align="right">Details</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No feedback found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.new
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <NameAvatarCell name={item.userName} email={item.userEmail} />
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                      <TableCell>{item.rating ? `${item.rating}/5` : '—'}</TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Typography variant="body2" noWrap>{item.message}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      {canWrite ? (
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button size="small" variant="outlined" onClick={() => openDetails(item)}>Review</Button>
                            <Button size="small" color="error" variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={() => handleDelete(item)}>
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      ) : (
                        <TableCell align="right">
                          <Button size="small" variant="outlined" onClick={() => openDetails(item)}>View</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {totalPages > 1 ? (
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" disabled={page <= 1 || loading} onClick={() => loadFeedback(page - 1)}>Previous</Button>
          <Button variant="contained" disabled={page >= totalPages || loading} onClick={() => loadFeedback(page + 1)}>Next</Button>
        </Stack>
      ) : null}

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{canWrite ? 'Review feedback' : 'Feedback details'}</DialogTitle>
        <DialogContent>
          {selected ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                From {selected.userName} · {selected.userEmail}
              </Typography>
              <Typography variant="body1">{selected.message}</Typography>
              {canWrite ? (
                <>
                  <SearchableSelect
                    label="Status"
                    value={editStatus}
                    onChange={setEditStatus}
                    options={STATUS_OPTIONS.filter((option) => option.value !== 'All')}
                    fullWidth
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Admin note"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Status: {selected.status}
                  </Typography>
                  {selected.adminNote ? (
                    <Typography variant="body2">Admin note: {selected.adminNote}</Typography>
                  ) : null}
                </>
              )}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>{canWrite ? 'Cancel' : 'Close'}</Button>
          {canWrite ? (
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
