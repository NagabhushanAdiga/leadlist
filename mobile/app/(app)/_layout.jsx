import { Drawer } from 'expo-router/drawer'
import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native'
import { useAuth } from '../../src/context/AuthContext'
import { useAppTheme } from '../../src/context/ThemeContext'
import { AppDrawerContent } from '../../src/components/AppDrawerContent'
import { AccountDisabledScreen } from '../../src/components/auth/AccountDisabledScreen'

export default function AppLayout() {
  const { user, hydrated, isAccountActive, refreshAccountStatus } = useAuth()
  const { colors } = useAppTheme()

  useEffect(() => {
    if (!user?.email) {
      return undefined
    }

    refreshAccountStatus()

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshAccountStatus()
      }
    })

    return () => subscription.remove()
  }, [user?.email, refreshAccountStatus])

  if (!hydrated) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />
  }

  if (!isAccountActive) {
    return <AccountDisabledScreen />
  }

  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 20 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: { fontSize: 17 },
        sceneContainerStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerLabel: 'Profile',
        }}
      />
      <Drawer.Screen
        name="profile-edit"
        options={{
          title: 'Edit Profile',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="change-password"
        options={{
          title: 'Change Password',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="leads"
        options={{
          title: 'Leads List',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          drawerLabel: 'Reminders',
        }}
      />
      <Drawer.Screen
        name="upload"
        options={{
          title: 'Upload Excel',
          drawerLabel: 'Upload Excel',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
