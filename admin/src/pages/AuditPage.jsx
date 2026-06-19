import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined'
import HistoryIcon from '@mui/icons-material/HistoryOutlined'
import SearchIcon from '@mui/icons-material/SearchOutlined'
import { api } from '../services'
import { NameAvatarCell } from '../components/NameAvatarCell'
import { PageHeader } from '../components/PageHeader'
import { buildLabelOptions, SearchableSelect } from '../components/SearchableSelect'
import { useConfirm } from '../context/ConfirmContext'
import { useAdminAccess } from '../hooks/useAdminAccess'

const ENTITY_TYPES = ['All', 'user', 'lead', 'admin', 'profile', 'password']
const ACTIONS = ['All', 'create', 'update', 'delete', 'import']
const ACTOR_TYPES = ['All', 'admin', 'user']

function labelize(value) {
  if (!value || value === 'All') return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const ENTITY_OPTIONS = buildLabelOptions(ENTITY_TYPES, {
  formatLabel: (value) => (value === 'All' ? 'All entities' : labelize(value)),
})
const ACTION_OPTIONS = buildLabelOptions(ACTIONS, {
  formatLabel: (value) => (value === 'All' ? 'All actions' : labelize(value)),
})
const ACTOR_OPTIONS = buildLabelOptions(ACTOR_TYPES, {
  formatLabel: (value) => (value === 'All' ? 'Everyone' : labelize(value)),
})

const ACTION_STYLES = {
  create: { label: 'Create', color: '#10b981', bg: '#ecfdf5' },
  update: { label: 'Update', color: '#0ea5e9', bg: '#eff8ff' },
  delete: { label: 'Delete', color: '#ef4444', bg: '#fef2f2' },
  import: { label: 'Import', color: '#8b5cf6', bg: '#f5f3ff' },
}

const ENTITY_STYLES = {
  user: { color: '#6c63ff', bg: '#f3f2ff' },
  lead: { color: '#0ea5e9', bg: '#eff8ff' },
  admin: { color: '#f59e0b', bg: '#fffbeb' },
  profile: { color: '#10b981', bg: '#ecfdf5' },
  password: { color: '#ef4444', bg: '#fef2f2' },
}

function formatWhen(value) {
  if (!value) return { day: '—', time: '—', full: '—' }
  const date = new Date(value)
  return {
    day: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    full: date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
  }
}

function ActionChip({ action }) {
  const style = ACTION_STYLES[action] || { label: labelize(action), color: '#6b7280', bg: '#f3f4f6' }

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, height: 24 }}
    />
  )
}

function EntityChip({ entityType }) {
  const style = ENTITY_STYLES[entityType] || { color: '#6b7280', bg: '#f3f4f6' }

  return (
    <Chip
      label={labelize(entityType)}
      size="small"
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, height: 24 }}
    />
  )
}

function ChangePanel({ changes }) {
  if (!changes?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No field-level changes recorded.
      </Typography>
    )
  }

  return (
    <Stack spacing={1}>
      {changes.map((change) => (
        <Box
          key={change.field}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '120px 1fr 24px 1fr' },
            gap: 1,
            alignItems: 'center',
            p: 1.25,
            bgcolor: '#fff',
            border: '1px solid #eef0ff',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
            {change.field}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            {String(change.from ?? '—')}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ textAlign: 'center' }}>
            →
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
            {String(change.to ?? '—')}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

function AuditTimelineItem({ entry }) {
  const when = formatWhen(entry.createdAt)
  const actionStyle = ACTION_STYLES[entry.action] || ACTION_STYLES.update

  return (
    <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, position: 'relative' }}>
      <Box
        sx={{
          width: { xs: 56, md: 72 },
          flexShrink: 0,
          textAlign: 'right',
          pt: 0.5,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ color: '#1a1a2e' }}>
          {when.time}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {when.day}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: actionStyle.color,
            border: '2px solid #fff',
            boxShadow: `0 0 0 2px ${actionStyle.color}55`,
            mt: 0.75,
            zIndex: 1,
          }}
        />
        <Box sx={{ flex: 1, width: 2, bgcolor: '#eef0ff', mt: 0.5, minHeight: 16 }} />
      </Box>

      <Card
        sx={{
          flex: 1,
          mb: 2,
          borderLeft: `4px solid ${actionStyle.color}`,
          bgcolor: actionStyle.bg,
          borderColor: `${actionStyle.color}33`,
        }}
      >
        <CardContent sx={{ p: { xs: 1.75, md: 2.25 }, '&:last-child': { pb: { xs: 1.75, md: 2.25 } } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
            sx={{ mb: 1.5 }}
          >
            <Stack direction="row" spacing={0.75} flexWrap="wrap">
              <ActionChip action={entry.action} />
              <EntityChip entityType={entry.entityType} />
              <Chip label={labelize(entry.actorType)} size="small" sx={{ height: 24, fontWeight: 600 }} />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
              {when.full}
            </Typography>
          </Stack>

          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1a1a2e', mb: 1.25, lineHeight: 1.4 }}>
            {entry.summary}
          </Typography>

          <NameAvatarCell name={entry.actorName} email={entry.actorEmail} />

          {entry.entityLabel ? (
            <Typography variant="body2" sx={{ mt: 1.25, color: '#4b5563' }}>
              Target: <strong>{entry.entityLabel}</strong>
            </Typography>
          ) : null}

          {entry.changes?.length ? (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mt: 1.5,
                bgcolor: '#fff',
                border: '1px solid #eef0ff',
                borderRadius: '4px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 44, px: 1.5 }}>
                <Typography variant="body2" fontWeight={700}>
                  View {entry.changes.length} change{entry.changes.length === 1 ? '' : 's'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
                <ChangePanel changes={entry.changes} />
              </AccordionDetails>
            </Accordion>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  )
}

function FilterPanel({
  entityType,
  action,
  actorType,
  search,
  dateFrom,
  dateTo,
  activeFilterCount,
  onEntityType,
  onAction,
  onActorType,
  onSearch,
  onDateFrom,
  onDateTo,
  onApply,
  onClear,
  onDeleteRange,
}) {
  const { canWrite } = useAdminAccess()

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Filters
          </Typography>
          {activeFilterCount ? (
            <Chip label={activeFilterCount} size="small" color="primary" sx={{ fontWeight: 700, minWidth: 28 }} />
          ) : null}
        </Stack>

        <Stack spacing={1.75}>
          <SearchableSelect
            label="Entity"
            value={entityType}
            onChange={onEntityType}
            options={ENTITY_OPTIONS}
            fullWidth
          />

          <SearchableSelect
            label="Action"
            value={action}
            onChange={onAction}
            options={ACTION_OPTIONS}
            fullWidth
          />

          <SearchableSelect
            label="Updated by"
            value={actorType}
            onChange={onActorType}
            options={ACTOR_OPTIONS}
            fullWidth
          />

          <TextField
            fullWidth
            size="small"
            label="Search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onApply()
            }}
            placeholder="Name, email, summary..."
          />

          <TextField
            fullWidth
            size="small"
            type="date"
            label="From date"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => onDateFrom(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            type="date"
            label="To date"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => onDateTo(e.target.value)}
          />

          <Divider sx={{ my: 0.5 }} />

          <Button variant="contained" fullWidth startIcon={<SearchIcon />} onClick={onApply}>
            Apply filters
          </Button>
          <Button variant="outlined" fullWidth onClick={onClear}>
            Clear all
          </Button>
          {canWrite ? (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<DeleteOutlineIcon />}
              onClick={onDeleteRange}
            >
              Delete in range
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export function AuditPage() {
  const confirm = useConfirm()
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [entityType, setEntityType] = useState('All')
  const [action, setAction] = useState('All')
  const [actorType, setActorType] = useState('All')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (entityType !== 'All') count += 1
    if (action !== 'All') count += 1
    if (actorType !== 'All') count += 1
    if (search.trim()) count += 1
    if (dateFrom) count += 1
    if (dateTo) count += 1
    return count
  }, [entityType, action, actorType, search, dateFrom, dateTo])

  const loadLogs = async (nextPage = page) => {
    setLoading(true)
    setError('')

    try {
      const data = await api.getAuditLogs({
        page: nextPage,
        limit: 20,
        entityType,
        action,
        actorType,
        search,
        dateFrom,
        dateTo,
      })
      setLogs(data.items)
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
    loadLogs(1)
  }, [entityType, action, actorType, dateFrom, dateTo])

  const handleSearch = () => loadLogs(1)

  const clearFilters = () => {
    setEntityType('All')
    setAction('All')
    setActorType('All')
    setSearch('')
    setDateFrom('')
    setDateTo('')
  }

  const handleDeleteRange = async () => {
    if (!dateFrom || !dateTo) {
      setError('Select both start and end dates to delete logs.')
      return
    }

    const confirmed = await confirm({
      title: 'Delete audit logs?',
      message: `Delete all audit logs from ${dateFrom} to ${dateTo} matching current filters? This cannot be undone.`,
      confirmLabel: 'Delete Logs',
      variant: 'danger',
    })

    if (!confirmed) return

    try {
      const result = await api.deleteAuditLogs({ entityType, action, actorType, search, dateFrom, dateTo })
      setSuccess(`Deleted ${result.deletedCount} log(s).`)
      loadLogs(1)
    } catch (err) {
      setError(err.message)
    }
  }

  const quickSetAction = (nextAction) => {
    setAction(nextAction)
  }

  return (
    <Box>
      <PageHeader subtitle="Track every create, update, delete, and import across the system" />

      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #6c63ff 0%, #8b5cf6 55%, #0ea5e9 100%)',
          color: '#fff',
          border: 'none',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                <HistoryIcon />
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.1 }}>
                  ACTIVITY LOG
                </Typography>
              </Stack>
              <Typography variant="h5" fontWeight={800}>
                {total} event{total === 1 ? '' : 's'} recorded
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Page {page} of {totalPages || 1} · Showing {logs.length} on this page
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {ACTIONS.map((item) => (
                <Chip
                  key={item}
                  label={item === 'All' ? 'All' : labelize(item)}
                  onClick={() => quickSetAction(item)}
                  sx={{
                    bgcolor: action === item ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.18)',
                    color: action === item ? 'primary.main' : '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <FilterPanel
              entityType={entityType}
              action={action}
              actorType={actorType}
              search={search}
              dateFrom={dateFrom}
              dateTo={dateTo}
              activeFilterCount={activeFilterCount}
              onEntityType={setEntityType}
              onAction={setAction}
              onActorType={setActorType}
              onSearch={setSearch}
              onDateFrom={setDateFrom}
              onDateTo={setDateTo}
              onApply={handleSearch}
              onClear={clearFilters}
              onDeleteRange={handleDeleteRange}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          <Paper sx={{ p: { xs: 1.5, md: 2.5 }, minHeight: 360 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={44} />
              </Box>
            ) : logs.length === 0 ? (
              <Box sx={{ py: 10, px: 2, textAlign: 'center' }}>
                <HistoryIcon sx={{ fontSize: 52, color: 'primary.main', mb: 1.5, opacity: 0.75 }} />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                  No audit events found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try different filters or a wider date range.
                </Typography>
              </Box>
            ) : (
              <Box>
                {logs.map((entry) => (
                  <AuditTimelineItem key={entry.id} entry={entry} />
                ))}
              </Box>
            )}

            {totalPages > 1 ? (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems="center"
                sx={{ pt: 2, mt: 1, borderTop: '1px solid #eef0ff' }}
              >
                <Typography variant="body2" color="text.secondary">
                  Page {page} of {totalPages}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" disabled={page <= 1 || loading} onClick={() => loadLogs(page - 1)}>
                    Previous
                  </Button>
                  <Button variant="contained" disabled={page >= totalPages || loading} onClick={() => loadLogs(page + 1)}>
                    Next
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
