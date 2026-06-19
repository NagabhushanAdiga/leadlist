import { Linking, Platform } from 'react-native'

export function formatPhone(phone) {
  if (!phone) {
    return '—'
  }

  const digits = String(phone).replace(/\D/g, '')

  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }

  return String(phone).trim() || '—'
}

export function sanitizePhoneForDial(phone) {
  if (!phone) {
    return ''
  }

  const trimmed = String(phone).trim()

  if (trimmed.startsWith('+')) {
    return `+${trimmed.slice(1).replace(/\D/g, '')}`
  }

  return trimmed.replace(/\D/g, '')
}

export function formatFollowUpDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function handleCall(phone) {
  const sanitized = sanitizePhoneForDial(phone)

  if (!sanitized) {
    return { ok: false, message: 'No phone number available for this lead.' }
  }

  const url = `tel:${sanitized}`

  try {
    if (Platform.OS === 'android') {
      await Linking.openURL(url)
      return { ok: true }
    }

    const canOpen = await Linking.canOpenURL(url)

    if (canOpen) {
      await Linking.openURL(url)
      return { ok: true }
    }

    return { ok: false, message: 'Unable to open the phone dialer on this device.' }
  } catch {
    return { ok: false, message: 'Could not start the call. Please try again.' }
  }
}
