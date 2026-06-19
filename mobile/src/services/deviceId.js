import AsyncStorage from '@react-native-async-storage/async-storage'

const DEVICE_ID_KEY = '@device_id'

export async function getDeviceId() {
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY)

  if (stored) {
    return stored
  }

  const deviceId = `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId)
  return deviceId
}
