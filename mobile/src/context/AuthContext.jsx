import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  setAuthToken,
  userLogin as apiUserLogin,
  userRegister as apiUserRegister,
} from '../services/api'
import {
  clearUserSession,
  getUserSession,
  saveUserSession,
} from '../services/userStorage'

const AuthContext = createContext(null)

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

async function fetchUserFromServer(email, password) {
  const data = await apiUserLogin(email, password)
  setAuthToken(data.token)
  return { user: buildUser(data.user), token: data.token }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    async function restoreSession() {
      const session = await getUserSession()

      if (session?.user?.email && session?.password) {
        if (session.token) {
          setAuthToken(session.token)
          setToken(session.token)
        }

        try {
          const nextSession = await fetchUserFromServer(session.user.email, session.password)
          setUser(nextSession.user)
          setPassword(session.password)
          setToken(nextSession.token)
          await saveUserSession(nextSession.user, session.password, nextSession.token)
        } catch (err) {
          if (err.message === 'Invalid email or password.') {
            setAuthToken(null)
            await clearUserSession()
          } else {
            setUser(buildUser(session.user))
            setPassword(session.password)
            if (session.token) {
              setAuthToken(session.token)
              setToken(session.token)
            }
          }
        }
      }

      setHydrated(true)
    }

    restoreSession()
  }, [])

  const refreshAccountStatus = useCallback(async () => {
    if (!user?.email || !password) {
      return
    }

    try {
      const nextSession = await fetchUserFromServer(user.email, password)
      setUser((current) => {
        if (
          current?.enabled === nextSession.user.enabled &&
          current?.name === nextSession.user.name &&
          current?.email === nextSession.user.email
        ) {
          return current
        }

        return nextSession.user
      })
      await saveUserSession(nextSession.user, password, nextSession.token)
      setToken(nextSession.token)
    } catch (err) {
      if (err.message === 'Invalid email or password.') {
        setAuthToken(null)
        setUser(null)
        setPassword('')
        await clearUserSession()
      }
    }
  }, [user?.email, password])

  const value = useMemo(
    () => ({
      user,
      hydrated,
      isAccountActive: user?.enabled === true,
      refreshAccountStatus,
      async login(email, loginPassword) {
        const nextSession = await fetchUserFromServer(email, loginPassword)
        setUser(nextSession.user)
        setPassword(loginPassword)
        setToken(nextSession.token)
        await saveUserSession(nextSession.user, loginPassword, nextSession.token)
        return nextSession.user
      },
      async register(name, email, registerPassword) {
        const data = await apiUserRegister(name, email, registerPassword)
        setAuthToken(data.token)
        const nextUser = buildUser(data.user)
        setUser(nextUser)
        setPassword(registerPassword)
        setToken(data.token)
        await saveUserSession(nextUser, registerPassword, data.token)
        return nextUser
      },
      async updateProfile(updates) {
        if (!user) {
          throw new Error('No user logged in.')
        }

        const nextUser = buildUser({
          ...user,
          ...updates,
          name: updates.name?.trim() || user.name,
          email: updates.email?.trim() || user.email,
          mobile: updates.mobile?.trim() || user.mobile,
          role: updates.role?.trim() || user.role,
          company: updates.company?.trim() || user.company,
        })
        setUser(nextUser)
        await saveUserSession(nextUser, password, token)
        return nextUser
      },
      async changePassword(currentPassword, newPassword) {
        if (!user) {
          throw new Error('No user logged in.')
        }

        if (currentPassword !== password) {
          throw new Error('Current password is incorrect.')
        }

        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters.')
        }

        setPassword(newPassword)
        await saveUserSession(user, newPassword, token)
      },
      logout() {
        setAuthToken(null)
        setToken(null)
        setUser(null)
        setPassword('')
        clearUserSession()
      },
    }),
    [user, password, token, hydrated, refreshAccountStatus],
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
