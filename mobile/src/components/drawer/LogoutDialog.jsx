import { Button, Dialog, Portal, Text } from 'react-native-paper'

export function LogoutDialog({ visible, colors, onDismiss, onConfirm }) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={[styles.dialog, { backgroundColor: colors.surface }]}
      >
        <Dialog.Icon icon="logout" color="#EF4444" />
        <Dialog.Title style={styles.title}>Sign Out</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={[styles.message, { color: colors.textSecondary }]}>
            Are you sure you want to sign out of your account?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor="#6B7280">
            Cancel
          </Button>
          <Button onPress={onConfirm} textColor="#EF4444">
            Sign Out
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = {
  dialog: {
    borderRadius: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  message: {
    textAlign: 'center',
  },
}
