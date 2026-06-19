import { Box, Button, Typography } from '@mui/material'

export function PageHeader({ title, subtitle, actionLabel, onAction, actionIcon }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        {title ? (
          <Typography variant="h5" sx={{ mb: subtitle ? 0.5 : 0 }}>
            {title}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actionLabel && onAction ? (
        <Button variant="contained" startIcon={actionIcon} onClick={onAction} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  )
}
