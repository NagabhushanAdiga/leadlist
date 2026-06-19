import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  changeMyPassword,
  fetchMyProfile,
  updateMyProfile,
  userLogin as apiUserLogin,
  userLogout as apiUserLogout,
  userRegister as apiUserRegister,
} from '../services/authService'
import { getDeviceId } from '../services/deviceId'
import { setAuthToken, setUnauthorizedHandler } from '../services/httpClient'
import {
  clearUserSession,
  getUserSession,
  saveUserSession,
} from '../services/userStorage'

const AuthContext = createContext(null)

const SESSION_EXPIRED_MESSAGE =
  'Your session expired. This account is signed in on another device. Please sign in again.'

function buildUser({ id, name, email, mobile, role, company, enabled }) {
  return {
    id,
    name,
    email,
    mobile: mobile || '',
    role: role || 'Sales Executive',
    company: company || '',
    enabled: enabled === true,
  }
}

function isSessionExpiredError(message) {
  return (
    message === SESSION_EXPIRED_MESSAGE ||
    message === 'Unauthorized' ||
    message?.includes('signed in on another device')
  )
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(null)
  const [hydrated, setHydrated] = useState(false)
  const [sessionMessage, setSessionMessage] = useState('')

  const forceLogout = useCallback(async (message) => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
    setPassword('')
    await clearUserSession()

    if (message) {
      setSessionMessage(message)
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      forceLogout(message || SESSION_EXPIRED_MESSAGE)
    })

    return () => setUnauthorizedHandler(null)
  }, [forceLogout])

  useEffect(() => {
    async function restoreSession() {
      const session = await getUserSession()

      if (session?.token && session?.user?.email) {
        setAuthToken(session.token)
        setToken(session.token)
        setPassword(session.password || '')

        try {
          const profile = await fetchMyProfile()
          const nextUser = buildUser(profile)
          setUser(nextUser)
          await saveUserSession(nextUser, session.password || '', session.token)
        } catch (err) {
          if (isSessionExpiredError(err.message)) {
            await forceLogout(SESSION_EXPIRED_MESSAGE)
          } else {
            setUser(buildUser(session.user))
          }
        }
      }

      setHydrated(true)
    }

    restoreSession()
  }, [forceLogout])

  const refreshAccountStatus = useCallback(async () => {
    if (!token) {
      return
    }

    try {
      const profile = await fetchMyProfile()
      const nextUser = buildUser(profile)

      setUser((current) => {
        if (
          current?.enabled === nextUser.enabled &&
          current?.name === nextUser.name &&
          current?.email === nextUser.email
        ) {
          return current
        }

        return nextUser
      })

      await saveUserSession(nextUser, password, token)
    } catch (err) {
      if (isSessionExpiredError(err.message)) {
        await forceLogout(SESSION_EXPIRED_MESSAGE)
      }
    }
  }, [token, password, forceLogout])

  const value = useMemo(
    () => ({
      user,
      hydrated,
      sessionMessage,
      isAccountActive: user?.enabled === true,
      refreshAccountStatus,
      clearSessionMessage: () => setSessionMessage(''),
      async login(email, loginPassword) {
        const deviceId = await getDeviceId()
        const data = await apiUserLogin(email, loginPassword, deviceId)
        setAuthToken(data.token)
        const nextUser = buildUser(data.user)
        setUser(nextUser)
        setPassword(loginPassword)
        setToken(data.token)
        setSessionMessage('')
        await saveUserSession(nextUser, loginPassword, data.token)
        return nextUser
      },
      async register(name, email, registerPassword) {
        const deviceId = await getDeviceId()
        const data = await apiUserRegister(name, email, registerPassword, deviceId)
        setAuthToken(data.token)
        const nextUser = buildUser(data.user)
        setUser(nextUser)
        setPassword(registerPassword)
        setToken(data.token)
        setSessionMessage('')
        await saveUserSession(nextUser, registerPassword, data.token)
        return nextUser
      },
      async updateProfile(updates) {
        if (!user) {
          throw new Error('No user logged in.')
        }

        const remoteUser = await updateMyProfile({
          name: updates.name?.trim() || user.name,
          email: updates.email?.trim() || user.email,
          mobile: updates.mobile?.trim() || user.mobile,
          role: updates.role?.trim() || user.role,
          company: updates.company?.trim() || user.company,
        })
        const nextUser = buildUser(remoteUser)
        setUser(nextUser)
        await saveUserSession(nextUser, password, token)
        return nextUser
      },
      async changePassword(currentPassword, newPassword) {
        if (!user) {
          throw new Error('No user logged in.')
        }

        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters.')
        }

        await changeMyPassword(currentPassword, newPassword)
        setPassword(newPassword)
        await saveUserSession(user, newPassword, token)
      },
      async logout() {
        try {
          await apiUserLogout()
        } catch {
          // Ignore logout errors.
        }

        setAuthToken(null)
        setToken(null)
        setUser(null)
        setPassword('')
        setSessionMessage('')
        await clearUserSession()
      },
    }),
    [user, password, token, hydrated, sessionMessage, refreshAccountStatus, forceLogout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
