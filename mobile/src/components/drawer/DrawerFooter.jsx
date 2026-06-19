import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function DrawerFooter({
  colors,
  paddingBottom,
  onChangePassword,
  onSignOut,
}) {
  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom,
          backgroundColor: colors.drawerFooter,
          borderTopColor: colors.borderStrong,
        },
      ]}
    >
      <Button
        mode="contained-tonal"
        icon="lock-reset"
        onPress={onChangePassword}
        textColor={colors.primary}
        buttonColor={colors.primarySoft}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.changePasswordLabel}
      >
        Change Password
      </Button>
      <Button
        mode="outlined"
        icon="logout"
        onPress={onSignOut}
        textColor={colors.dangerText}
        style={[styles.button, { borderColor: colors.dangerBorder, backgroundColor: colors.dangerSoft }]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.signOutLabel}
      >
        Sign Out
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  changePasswordLabel: {
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  signOutLabel: {
    fontWeight: '700',
    fontSize: fontSize.md,
  },
})
