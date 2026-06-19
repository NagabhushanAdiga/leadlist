import { Linking } from 'react-native'

export function formatPhone(phone) {
  if (phone.length === 10) {
    return `${phone.slice(0, 5)} ${phone.slice(5)}`
  }

  return phone
}

export function formatFollowUpDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function handleCall(phone) {
  const url = `tel:${phone}`
  const canOpen = await Linking.canOpenURL(url)

  if (canOpen) {
    await Linking.openURL(url)
  }
}
