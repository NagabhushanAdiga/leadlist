import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

export function FormSubmitButton({ label, loading, onPress }) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={loading}
      style={styles.button}
      contentStyle={styles.buttonContent}
      theme={{ roundness: 8 }}
    >
      {label}
    </Button>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
})
