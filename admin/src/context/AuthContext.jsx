import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_user')
    return stored ? JSON.parse(stored) : null
  })

  const value = useMemo(
    () => ({
      token,
      admin,
      isAuthenticated: Boolean(token),
      login(tokenValue, adminUser) {
        localStorage.setItem('admin_token', tokenValue)
        localStorage.setItem('admin_user', JSON.stringify(adminUser))
        setToken(tokenValue)
        setAdmin(adminUser)
      },
      logout() {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        setToken(null)
        setAdmin(null)
      },
    }),
    [token, admin],
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
