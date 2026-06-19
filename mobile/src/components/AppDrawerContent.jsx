import { DrawerContentScrollView } from '@react-navigation/drawer'
import { usePathname, useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DRAWER_MENU_ITEMS } from '../constants/drawerMenu'
import { useAuth } from '../context/AuthContext'
import { useAppTheme } from '../context/ThemeContext'
import {
  DrawerFooter,
  DrawerMenuSection,
  DrawerProfileHeader,
  LogoutDialog,
} from './drawer'

export function AppDrawerContent(props) {
  const { user, logout } = useAuth()
  const { colors } = useAppTheme()
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const navigate = (href) => {
    router.push(href)
    props.navigation.closeDrawer()
  }

  const confirmLogout = () => {
    setShowLogoutDialog(false)
    props.navigation.closeDrawer()
    logout()
  }

  const isActive = (item) => item.match.includes(pathname)

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <DrawerProfileHeader
        user={user}
        paddingTop={insets.top + 16}
        onPressProfile={() => navigate('/(app)/profile')}
      />

      <DrawerContentScrollView
        {...props}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DrawerMenuSection
          title="Menu"
          items={DRAWER_MENU_ITEMS}
          colors={colors}
          isActive={isActive}
          onNavigate={navigate}
        />
      </DrawerContentScrollView>

      <DrawerFooter
        colors={colors}
        paddingBottom={insets.bottom + 16}
        onChangePassword={() => navigate('/(app)/change-password')}
        onSignOut={() => setShowLogoutDialog(true)}
      />

      <LogoutDialog
        visible={showLogoutDialog}
        colors={colors}
        onDismiss={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
})
