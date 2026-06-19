import { Avatar, Box, Stack, Typography } from '@mui/material'

const AVATAR_COLORS = ['#6c63ff', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

function getAvatarColor(value = '') {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function NameAvatarCell({ name, email, subtitle }) {
  const label = name || email || '—'
  const initial = label.charAt(0).toUpperCase()

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, py: 0.5 }}>
      <Avatar
        sx={{
          width: 42,
          height: 42,
          bgcolor: getAvatarColor(name || email),
          fontWeight: 700,
          fontSize: '0.95rem',
          flexShrink: 0,
        }}
      >
        {initial}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={700} noWrap>
          {name || '—'}
        </Typography>
        {email ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {email}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  )
}
