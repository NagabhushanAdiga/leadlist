import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_SESSION_KEY = '@user_session'

export async function saveUserSession(user, password, token) {
  await AsyncStorage.setItem(
    USER_SESSION_KEY,
    JSON.stringify({ user, password, token: token || null }),
  )
}

export async function getUserSession() {
  const stored = await AsyncStorage.getItem(USER_SESSION_KEY)
  if (!stored) {
    return null
  }

  return JSON.parse(stored)
}

export async function clearUserSession() {
  await AsyncStorage.removeItem(USER_SESSION_KEY)
}
