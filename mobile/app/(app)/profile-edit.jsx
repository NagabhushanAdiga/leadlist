import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Snackbar, TextInput } from 'react-native-paper'
import { AppFormField } from '../../src/components/AppFormField'
import { FormError, FormScreenLayout, FormSubmitButton } from '../../src/components/forms'
import { useAuth } from '../../src/context/AuthContext'

export default function ProfileEditScreen() {
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setMobile(user.mobile || '')
      setRole(user.role || '')
      setCompany(user.company || '')
    }
  }, [user])

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !mobile.trim()) {
      setError('Name, email, and mobile are required.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        role: role.trim(),
        company: company.trim(),
      })
      setSuccess(true)
      setTimeout(() => router.back(), 600)
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormScreenLayout
      snackbar={
        <Snackbar visible={success} onDismiss={() => setSuccess(false)} duration={2000}>
          Profile updated successfully
        </Snackbar>
      }
    >
      <AppFormField
        label="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        left={<TextInput.Icon icon="account-outline" />}
      />

      <AppFormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        left={<TextInput.Icon icon="email-outline" />}
      />

      <AppFormField
        label="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        left={<TextInput.Icon icon="phone-outline" />}
      />

      <AppFormField
        label="Role"
        value={role}
        onChangeText={setRole}
        autoCapitalize="words"
        left={<TextInput.Icon icon="briefcase-outline" />}
      />

      <AppFormField
        label="Company"
        value={company}
        onChangeText={setCompany}
        autoCapitalize="words"
        left={<TextInput.Icon icon="office-building-outline" />}
      />

      <FormError message={error} />
      <FormSubmitButton label="Save Changes" loading={loading} onPress={handleSave} />
    </FormScreenLayout>
  )
}
