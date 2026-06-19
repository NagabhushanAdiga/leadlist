import { StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'

export function FormError({ message }) {
  if (!message) {
    return null
  }

  return (
    <HelperText type="error" visible style={styles.error}>
      {message}
    </HelperText>
  )
}

const styles = StyleSheet.create({
  error: {
    marginBottom: 8,
  },
})
