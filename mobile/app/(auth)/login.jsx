import { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout'
import { AuthTextField } from '../../src/components/AuthTextField'
import {
  AuthFormError,
  AuthFormFooter,
  AuthPasswordField,
  AuthSubmitButton,
} from '../../src/components/auth'
import { useAuth } from '../../src/context/AuthContext'

export default function LoginScreen() {
  const { login, sessionMessage, clearSessionMessage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionMessage) {
      setError(sessionMessage)
      clearSessionMessage()
    }
  }, [sessionMessage, clearSessionMessage])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout
      title="Welcome back"
      subtitle="Sign in to continue to your account"
      footer={
        <AuthFormFooter
          prompt="Don't have an account?"
          linkLabel="Sign up"
          href="/(auth)/register"
        />
      }
    >
      <AuthTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        left={<TextInput.Icon icon="email-outline" />}
      />

      <AuthPasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
      />

      <AuthFormError message={error} />
      <AuthSubmitButton label="Sign In" loading={loading} onPress={handleLogin} />
    </AuthScreenLayout>
  )
}
