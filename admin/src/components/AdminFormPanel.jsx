import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ADMIN_ROLES } from '../utils/adminRoles'

const DRAWER_WIDTH = 420

export function AdminFormPanel({ open, form, loading, error, onChange, onSubmit, onClose, showRoleField = false }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: DRAWER_WIDTH } } }}>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="primary" fontWeight={700}>
              NEW ADMIN
            </Typography>
            <Typography variant="h6">Add admin</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Create another admin account with access to this dashboard.
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Stack spacing={2} sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
          <TextField label="Full name" value={form.name} onChange={(e) => onChange({ name: e.target.value })} required fullWidth />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => onChange({ email: e.target.value })} required fullWidth />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => onChange({ password: e.target.value })} required fullWidth />
          <TextField label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => onChange({ confirmPassword: e.target.value })} required fullWidth />
          {showRoleField ? (
            <TextField
              select
              label="Access level"
              value={form.role || ADMIN_ROLES.ADMIN}
              onChange={(e) => onChange({ role: e.target.value })}
              fullWidth
              helperText="Admins can view only. Super admins can make changes."
            >
              <MenuItem value={ADMIN_ROLES.ADMIN}>Admin (read-only)</MenuItem>
              <MenuItem value={ADMIN_ROLES.SUPER_ADMIN}>Super Admin (full access)</MenuItem>
            </TextField>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>

        <Divider />

        <Stack direction="row" spacing={1.5} sx={{ p: 2.5 }}>
          <Button fullWidth variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button fullWidth type="submit" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Admin'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}
