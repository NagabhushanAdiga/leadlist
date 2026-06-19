import { useState } from 'react'
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

export default function RegisterScreen() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await register(name.trim(), email.trim(), password)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout
      title="Create account"
      subtitle="Sign up now. An admin must enable your account before you can use the app."
      footer={
        <AuthFormFooter
          prompt="Already have an account?"
          linkLabel="Sign in"
          href="/(auth)/login"
        />
      }
    >
      <AuthTextField
        label="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        left={<TextInput.Icon icon="account-outline" />}
      />

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

      <AuthPasswordField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        showToggle={false}
        icon="lock-check-outline"
      />

      <AuthFormError message={error} />
      <AuthSubmitButton label="Create Account" loading={loading} onPress={handleRegister} />
    </AuthScreenLayout>
  )
}
