import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { api } from '../services'
import { PageHeader } from '../components/PageHeader'
import { buildUserOptions, SearchableSelect } from '../components/SearchableSelect'
import { useAdminAccess } from '../hooks/useAdminAccess'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function UploadPage() {
  const { canWrite } = useAdminAccess()
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [historyUserId, setHistoryUserId] = useState('All')
  const [uploads, setUploads] = useState([])
  const [uploadsTotal, setUploadsTotal] = useState(0)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUploads = async (selectedUserId = historyUserId) => {
    setHistoryLoading(true)
    try {
      const data = await api.getExcelUploads({ userId: selectedUserId, limit: 50 })
      setUploads(data.items)
      setUploadsTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    api.getUsers().then((data) => { setUsers(data); if (data[0]) setUserId(data[0].id) }).catch((err) => setError(err.message))
  }, [])

  useEffect(() => { loadUploads(historyUserId) }, [historyUserId])

  const selectedUser = users.find((u) => u.id === userId)

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!userId || !file) { setError('Select a user and Excel file.'); return }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await api.importLeads(file, userId)
      setSuccess(`Imported ${result.count} leads for ${result.userName}.`)
      setFile(null)
      event.target.reset()
      loadUploads(historyUserId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <PageHeader subtitle="Upload Excel files for a specific user" />

      {canWrite ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Import Excel for User</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Expected columns: Name, Email, Phone, Company, Role, Status (optional)
            </Typography>
            <Box component="form" onSubmit={handleUpload}>
              <Stack spacing={2}>
                <SearchableSelect
                  label="Select user"
                  value={userId}
                  onChange={setUserId}
                  options={buildUserOptions(users, { showEmail: true })}
                  fullWidth
                  required
                />
                {selectedUser ? (
                  <Typography variant="body2" color="text.secondary">
                    Leads will be assigned to <strong>{selectedUser.name}</strong>
                  </Typography>
                ) : null}
                <Button variant="outlined" component="label">
                  {file ? file.name : 'Choose Excel file'}
                  <input type="file" hidden accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </Button>
                <Button type="submit" variant="contained" startIcon={<UploadFileIcon />} disabled={loading || !users.length}>
                  {loading ? 'Importing...' : 'Import Leads'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ) : null}

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert> : null}

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
        <Typography variant="h6">Upload History</Typography>
        <SearchableSelect
          label="Filter by user"
          value={historyUserId}
          onChange={setHistoryUserId}
          options={buildUserOptions(users, { includeAll: true })}
          minWidth={280}
          boxSx={{ width: { xs: '100%', sm: 280 } }}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{uploadsTotal} upload(s)</Typography>

      {historyLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>User</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Leads</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Uploaded by</TableCell>
                <TableCell>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploads.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No uploads yet.</TableCell></TableRow>
              ) : uploads.map((upload) => (
                <TableRow key={upload.id} hover>
                  <TableCell>{formatDate(upload.createdAt)}</TableCell>
                  <TableCell>{upload.userName}</TableCell>
                  <TableCell>{upload.fileName}</TableCell>
                  <TableCell>{upload.leadCount}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{upload.uploadedByName}</TableCell>
                  <TableCell>
                    <Chip label={upload.source === 'admin' ? 'Admin' : 'Mobile'} size="small" color={upload.source === 'admin' ? 'primary' : 'success'} variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
