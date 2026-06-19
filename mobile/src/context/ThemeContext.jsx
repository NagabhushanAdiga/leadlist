import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PaperProvider } from 'react-native-paper'
import { buildPaperTheme } from '../theme'
import { darkAppColors, lightAppColors } from '../theme/colors'
const THEME_STORAGE_KEY = '@mobileappp/theme-mode'
const ThemeContext = createContext(null)
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    async function loadTheme() {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      setIsDark(stored === 'dark')
      setHydrated(true)
    }

    loadTheme()
  }, [])
  const setThemeMode = async (dark) => {
    setIsDark(dark)
    await AsyncStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
  }
  const toggleTheme = () => setThemeMode(!isDark)
  const paperTheme = useMemo(() => buildPaperTheme(isDark), [isDark])
  const colors = useMemo(() => (isDark ? darkAppColors : lightAppColors), [isDark])
  const value = useMemo(
    () => ({
      isDark,
      hydrated,
      colors,
      setThemeMode,
      toggleTheme,
      setLightMode: () => setThemeMode(false),
      setDarkMode: () => setThemeMode(true),
    }),
    [isDark, hydrated, colors],
  )

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  )
}

export function useAppTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider')
  }

  return context
}
