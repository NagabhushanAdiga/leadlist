import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import { api } from '../services'
import { LEAD_STATUSES, STATUS_COLORS } from '../constants/leadStatuses'

const FOUR_COLUMN = { xs: 12, sm: 6, md: 3 }
const SECTION_SPACING = { xs: 2, sm: 2.5, md: 3 }

const METRIC_CARDS = [
  {
    key: 'users',
    label: 'Users',
    meta: 'Registered accounts',
    icon: PeopleIcon,
    color: '#6c63ff',
    bg: 'linear-gradient(135deg, #f3f2ff 0%, #ebe9ff 100%)',
  },
  {
    key: 'leads',
    label: 'Leads',
    meta: 'Total in system',
    icon: ContactPageIcon,
    color: '#0ea5e9',
    bg: 'linear-gradient(135deg, #eff8ff 0%, #e0f2fe 100%)',
  },
  {
    key: 'tracked',
    label: 'Tracked',
    meta: 'Across all statuses',
    icon: TrendingUpIcon,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
  },
  {
    key: 'top',
    label: 'Top status',
    metaKey: 'topStatus',
    icon: StarIcon,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  },
]

const QUICK_LINKS = [
  { to: '/dashboard/users', label: 'Users', icon: PeopleIcon, color: '#6c63ff', bg: '#f3f2ff' },
  { to: '/dashboard/leads', label: 'Leads', icon: ContactPageIcon, color: '#0ea5e9', bg: '#eff8ff' },
  { to: '/dashboard/upload', label: 'Upload', icon: TrendingUpIcon, color: '#10b981', bg: '#ecfdf5' },
  { to: '/dashboard/audit', label: 'Audit', icon: StarIcon, color: '#f59e0b', bg: '#fffbeb' },
]

function SectionTitle({ children }) {
  return (
    <Typography
      variant="h6"
      fontWeight={700}
      sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' } }}
    >
      {children}
    </Typography>
  )
}

function MetricCard({ icon: Icon, label, value, meta, color, bg }) {
  return (
    <Card
      sx={{
        height: '100%',
        minHeight: { xs: 150, sm: 165, md: 178 },
        background: bg,
        borderColor: `${color}33`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 5,
          height: '100%',
          bgcolor: color,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.25, md: 2.75 }, pl: { xs: 2.5, md: 3.25 }, height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Box
            sx={{
              width: { xs: 48, sm: 52, md: 58 },
              height: { xs: 48, sm: 52, md: 58 },
              borderRadius: 1,
              bgcolor: color,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              boxShadow: `0 8px 20px ${color}40`,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: { xs: 24, sm: 26, md: 30 } }} />
          </Box>
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: `${color}18`,
              color,
              fontWeight: 700,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              height: { xs: 26, md: 30 },
              maxWidth: '50%',
            }}
          />
        </Stack>
        <Typography
          fontWeight={800}
          sx={{
            color: '#1a1a2e',
            lineHeight: 1.1,
            fontSize: { xs: '1.85rem', sm: '2.1rem', md: '2.35rem' },
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#4b5563',
            mt: 0.75,
            fontWeight: 500,
            fontSize: { xs: '0.82rem', md: '0.9rem' },
            lineHeight: 1.4,
          }}
        >
          {meta}
        </Typography>
      </CardContent>
    </Card>
  )
}

function StatusCard({ status, count, color, totalLeads }) {
  const percent = totalLeads ? (count / totalLeads) * 100 : 0

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: { xs: 138, sm: 148, md: 158 },
        background: `linear-gradient(135deg, ${color}14 0%, ${color}08 100%)`,
        borderColor: `${color}33`,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.25, md: 2.75 }, height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: color,
              boxShadow: `0 0 0 4px ${color}22`,
              flexShrink: 0,
            }}
          />
          <Typography
            fontWeight={700}
            sx={{
              color: '#1a1a2e',
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
              lineHeight: 1.3,
            }}
          >
            {status}
          </Typography>
        </Stack>
        <Typography
          fontWeight={800}
          sx={{ color, fontSize: { xs: '1.65rem', sm: '1.85rem', md: '2rem' } }}
        >
          {count}
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, fontSize: { xs: '0.72rem', md: '0.75rem' } }}>
          {percent.toFixed(0)}% of all leads
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            mt: { xs: 1.5, md: 2 },
            height: { xs: 8, md: 10 },
            borderRadius: 1,
            bgcolor: `${color}22`,
            '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 1 },
          }}
        />
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const statusCards = useMemo(() => {
    if (!stats) return []
    return LEAD_STATUSES.map((status) => ({
      status,
      count: stats.statusCounts[status] || 0,
      color: STATUS_COLORS[status] || '#6b7280',
    }))
  }, [stats])

  const activeLeads = useMemo(() => statusCards.reduce((sum, item) => sum + item.count, 0), [statusCards])
  const topStatus = useMemo(() => [...statusCards].sort((a, b) => b.count - a.count)[0], [statusCards])

  const metricValues = {
    users: stats?.totalUsers ?? 0,
    leads: stats?.totalLeads ?? 0,
    tracked: activeLeads,
    top: topStatus?.count ?? 0,
  }

  const metricMeta = {
    topStatus: topStatus?.status || 'No data yet',
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Card
        sx={{
          mb: { xs: 2.5, md: 3 },
          minHeight: { xs: 110, sm: 120, md: 130 },
          background: 'linear-gradient(135deg, #6c63ff 0%, #8b5cf6 55%, #0ea5e9 100%)',
          color: '#fff',
          border: 'none',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ opacity: 0.9, fontWeight: 700, letterSpacing: 1.2 }}>
              WELCOME BACK
            </Typography>
            <Typography
              fontWeight={800}
              sx={{ mt: 0.5, fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.85rem' } }}
            >
              Lead List overview
            </Typography>
            <Typography
              sx={{
                opacity: 0.92,
                mt: 1,
                maxWidth: 560,
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                lineHeight: 1.5,
              }}
            >
              Monitor users, lead pipeline, and activity from one place.
            </Typography>
          </Box>
          <Chip
            label="Live"
            sx={{
              bgcolor: 'rgba(255,255,255,0.22)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              height: 34,
              alignSelf: { xs: 'flex-start', sm: 'center' },
            }}
          />
        </CardContent>
      </Card>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={44} />
        </Box>
      ) : null}

      {stats ? (
        <>
          <SectionTitle>Overview</SectionTitle>
          <Grid container spacing={SECTION_SPACING} sx={{ mb: { xs: 3, md: 4 } }}>
            {METRIC_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <Grid key={card.key} size={FOUR_COLUMN}>
                  <MetricCard
                    icon={Icon}
                    label={card.label}
                    value={metricValues[card.key]}
                    meta={card.metaKey ? metricMeta[card.metaKey] : card.meta}
                    color={card.color}
                    bg={card.bg}
                  />
                </Grid>
              )
            })}
          </Grid>

          <SectionTitle>Leads by status</SectionTitle>
          <Grid container spacing={SECTION_SPACING} sx={{ mb: { xs: 3, md: 4 } }}>
            {statusCards.map(({ status, count, color }) => (
              <Grid key={status} size={FOUR_COLUMN}>
                <StatusCard
                  status={status}
                  count={count}
                  color={color}
                  totalLeads={stats.totalLeads}
                />
              </Grid>
            ))}
          </Grid>

          <SectionTitle>Quick actions</SectionTitle>
          <Grid container spacing={SECTION_SPACING}>
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Grid key={link.to} size={FOUR_COLUMN}>
                  <Card
                    component={RouterLink}
                    to={link.to}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '100%',
                      minHeight: { xs: 92, sm: 100, md: 108 },
                      bgcolor: link.bg,
                      borderColor: `${link.color}33`,
                      transition: 'transform 0.15s, border-color 0.15s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        borderColor: link.color,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, md: 2 },
                        p: { xs: 2, sm: 2.25, md: 2.75 },
                        height: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 50, sm: 54, md: 58 },
                          height: { xs: 50, sm: 54, md: 58 },
                          borderRadius: 1,
                          bgcolor: link.color,
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon sx={{ fontSize: { xs: 24, sm: 26, md: 30 } }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          fontWeight={700}
                          sx={{ color: '#1a1a2e', fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' } }}
                        >
                          {link.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: link.color,
                            fontWeight: 600,
                            mt: 0.25,
                            fontSize: { xs: '0.82rem', md: '0.875rem' },
                          }}
                        >
                          Open section
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </>
      ) : null}
    </Box>
  )
}
