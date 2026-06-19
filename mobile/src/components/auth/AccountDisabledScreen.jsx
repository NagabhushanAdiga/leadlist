import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useAuth } from '../../context/AuthContext'
import { useAppTheme } from '../../context/ThemeContext'

export function AccountDisabledScreen() {
  const { user, logout } = useAuth()
  const { colors } = useAppTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.text }]}>
          Account pending approval
        </Text>
        <Text variant="bodyMedium" style={[styles.message, { color: colors.textSecondary }]}>
          Your account ({user?.email}) is not active yet. You can sign in, but app pages are
          blocked until an administrator enables your account.
        </Text>
        <Text variant="bodyMedium" style={[styles.hint, { color: colors.textSecondary }]}>
          Please contact your administrator to get access.
        </Text>
        <Button mode="contained" onPress={logout} style={styles.button} buttonColor={colors.primary}>
          Sign Out
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    lineHeight: 22,
    marginBottom: 12,
  },
  hint: {
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
  },
})
