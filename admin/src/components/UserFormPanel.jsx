import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const DRAWER_WIDTH = 420

export function UserFormPanel({
  open,
  isEditing,
  form,
  loading,
  error,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: DRAWER_WIDTH } } }}>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="primary" fontWeight={700}>
              {isEditing ? 'EDIT USER' : 'NEW USER'}
            </Typography>
            <Typography variant="h6">{isEditing ? 'Update user details' : 'Add user'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isEditing
                ? 'Update account details for this mobile app user.'
                : 'Create a new mobile app user. Enable them after creation to allow app access.'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Stack spacing={2} sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
          <TextField label="Name" value={form.name} onChange={(e) => onChange({ name: e.target.value })} required fullWidth />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => onChange({ email: e.target.value })} required fullWidth />
          <TextField
            label={isEditing ? 'New password (optional)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(e) => onChange({ password: e.target.value })}
            required={!isEditing}
            fullWidth
          />
          <TextField label="Mobile" value={form.mobile} onChange={(e) => onChange({ mobile: e.target.value })} fullWidth />
          <TextField label="Role" value={form.role} onChange={(e) => onChange({ role: e.target.value })} fullWidth />
          <TextField label="Company" value={form.company} onChange={(e) => onChange({ company: e.target.value })} fullWidth />
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>

        <Divider />

        <Stack direction="row" spacing={1.5} sx={{ p: 2.5 }}>
          <Button fullWidth variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button fullWidth type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}
