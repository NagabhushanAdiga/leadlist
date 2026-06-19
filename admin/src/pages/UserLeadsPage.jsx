import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { api } from '../services'
import { PageHeader } from '../components/PageHeader'
import { buildUserOptions, SearchableSelect } from '../components/SearchableSelect'
import { STATUS_COLORS } from '../constants/leadStatuses'
import { useAdminAccess } from '../hooks/useAdminAccess'

export function UserLeadsPage() {
  const { canWrite } = useAdminAccess()
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState('')

  useEffect(() => {
    api.getUsers().then((data) => { setUsers(data); if (data[0]) setUserId(data[0].id) }).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (!userId) { setLeads([]); return }
    setLoading(true)
    api.getLeads(userId).then(setLeads).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [userId])

  const selectedUser = users.find((u) => u.id === userId)

  const handleDownload = async (type) => {
    if (!selectedUser) return
    setDownloading(type)
    setError('')
    try {
      if (type === 'excel') await api.downloadUserLeadsExcel(selectedUser.id, selectedUser.name)
      else await api.downloadUserLeadsPdf(selectedUser.id, selectedUser.name)
    } catch (err) {
      setError(err.message)
    } finally {
      setDownloading('')
    }
  }

  return (
    <Box>
      <PageHeader subtitle="View a user's lead list and download as Excel or PDF" />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems={{ sm: 'center' }}>
        <SearchableSelect
          label="Select user"
          value={userId}
          onChange={setUserId}
          options={buildUserOptions(users, { showEmail: true })}
          minWidth={320}
          boxSx={{ flex: { xs: '1 1 100%', sm: '1 1 320px' }, maxWidth: { sm: 480 } }}
        />
        {canWrite ? (
          <>
            <Button variant="contained" startIcon={<DownloadIcon />} disabled={!userId || downloading === 'excel'} onClick={() => handleDownload('excel')}>
              {downloading === 'excel' ? 'Downloading...' : 'Excel'}
            </Button>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} disabled={!userId || downloading === 'pdf'} onClick={() => handleDownload('pdf')}>
              {downloading === 'pdf' ? 'Downloading...' : 'PDF'}
            </Button>
          </>
        ) : null}
      </Stack>

      {selectedUser ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {leads.length} lead(s) for <strong>{selectedUser.name}</strong>
        </Typography>
      ) : null}

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Follow Up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No leads for this user.</TableCell></TableRow>
              ) : leads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{lead.email || '—'}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{lead.phone || '—'}</TableCell>
                  <TableCell>
                    <Chip label={lead.status} size="small" sx={{ bgcolor: `${STATUS_COLORS[lead.status]}22`, color: STATUS_COLORS[lead.status] }} />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{lead.followUpDate || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
