import { useEffect, useState } from 'react'
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
import { PageHeader } from '../components/PageHeader'
import { NameAvatarCell } from '../components/NameAvatarCell'
import { buildLabelOptions, buildUserOptions, SearchableSelect } from '../components/SearchableSelect'
import { LEAD_STATUSES, STATUS_COLORS } from '../constants/leadStatuses'
import { useConfirm } from '../context/ConfirmContext'
import { useAdminAccess } from '../hooks/useAdminAccess'

const STATUS_OPTIONS = buildLabelOptions(LEAD_STATUSES, { includeAll: true, allLabel: 'All' })

export function LeadsPage() {
  const confirm = useConfirm()
  const { canWrite } = useAdminAccess()
  const [users, setUsers] = useState([])
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [userFilter, setUserFilter] = useState('All')

  const loadLeads = (selectedUserId = userFilter) => {
    const userId = selectedUserId === 'All' ? undefined : selectedUserId
    api.getLeads(userId).then(setLeads).catch((err) => setError(err.message))
  }

  useEffect(() => {
    api.getUsers().then(setUsers).catch((err) => setError(err.message))
    loadLeads()
  }, [])

  const handleStatusChange = async (lead, status) => {
    try {
      await api.updateLead(lead.id, { ...lead, status })
      loadLeads()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (lead) => {
    const confirmed = await confirm({
      title: 'Delete lead?',
      message: `Delete ${lead.name}?`,
      confirmLabel: 'Delete',
      variant: 'danger',
    })
    if (!confirmed) return

    try {
      await api.deleteLead(lead.id)
      loadLeads()
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredLeads = filter === 'All' ? leads : leads.filter((l) => l.status === filter)

  return (
    <Box>
      <PageHeader subtitle="View and manage leads by user" />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems={{ sm: 'center' }}>
        <SearchableSelect
          label="Filter by user"
          value={userFilter}
          onChange={(value) => {
            setUserFilter(value)
            loadLeads(value)
          }}
          options={buildUserOptions(users, { includeAll: true })}
          minWidth={260}
        />
        <SearchableSelect
          label="Filter by status"
          value={filter}
          onChange={setFilter}
          options={STATUS_OPTIONS}
          minWidth={240}
        />
        <Typography variant="body2" color="text.secondary">{filteredLeads.length} lead(s)</Typography>
      </Stack>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Phone</TableCell>
              <TableCell>Status</TableCell>
              {canWrite ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow><TableCell colSpan={canWrite ? 6 : 5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No leads found.</TableCell></TableRow>
            ) : filteredLeads.map((lead) => (
              <TableRow key={lead.id} hover>
                <TableCell>{lead.userName || '—'}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{lead.email || '—'}</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{lead.phone || '—'}</TableCell>
                <TableCell sx={{ minWidth: canWrite ? 220 : 140 }}>
                  {canWrite ? (
                    <SearchableSelect
                      label="Status"
                      value={lead.status}
                      onChange={(status) => handleStatusChange(lead, status)}
                      options={buildLabelOptions(LEAD_STATUSES)}
                      minWidth={210}
                      hideLabel
                      textFieldSx={{ color: STATUS_COLORS[lead.status], fontWeight: 600 }}
                    />
                  ) : (
                    <Chip
                      label={lead.status}
                      size="small"
                      sx={{
                        bgcolor: `${STATUS_COLORS[lead.status]}22`,
                        color: STATUS_COLORS[lead.status],
                        fontWeight: 700,
                      }}
                    />
                  )}
                </TableCell>
                {canWrite ? (
                  <TableCell align="right">
                    <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(lead)}>Delete</Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
