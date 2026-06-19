import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { api } from '../services'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { title: 'User management', text: 'Create, edit, and remove mobile app users from one place.' },
  { title: 'Lead tracking', text: 'Monitor lead status, follow-ups, and loan pipeline updates.' },
  { title: 'Excel imports', text: 'Upload spreadsheets and sync lead data across the platform.' },
]

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@leadlist.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.login(email, password)
      login(result.token, result.admin)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          background: 'linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)',
          color: '#fff',
          p: 6,
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: 480 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', fontWeight: 700, mb: 2 }}>
            LL
          </Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Lead List Admin
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
            Central control panel for your mobile sales team, leads, and imports.
          </Typography>
          <Stack spacing={2}>
            {FEATURES.map((item) => (
              <Box key={item.title}>
                <Typography fontWeight={700}>{item.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: 3 }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="caption" color="primary" fontWeight={700}>
                ADMIN ACCESS
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5, mb: 0.5 }}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your credentials to open the dashboard
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                  <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
                  {error ? <Alert severity="error">{error}</Alert> : null}
                  <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Default: admin@leadlist.com / admin123
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}
