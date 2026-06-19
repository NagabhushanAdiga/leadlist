import { useState } from 'react'
import { Snackbar } from 'react-native-paper'
import {
  FormError,
  FormScreenLayout,
  FormSubmitButton,
  PasswordFormField,
} from '../../src/components/forms'
import { useAuth } from '../../src/context/AuthContext'

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormScreenLayout
      snackbar={
        <Snackbar visible={success} onDismiss={() => setSuccess(false)} duration={2500}>
          Password changed successfully
        </Snackbar>
      }
    >
      <PasswordFormField
        label="Current password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <PasswordFormField
        label="New password"
        value={newPassword}
        onChangeText={setNewPassword}
        icon="lock-plus-outline"
      />

      <PasswordFormField
        label="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        showToggle={false}
        icon="lock-check-outline"
      />

      <FormError message={error} />
      <FormSubmitButton label="Update Password" loading={loading} onPress={handleSubmit} />
    </FormScreenLayout>
  )
}
