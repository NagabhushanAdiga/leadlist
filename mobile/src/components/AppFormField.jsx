import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from 'react-native-paper'
import { fontSize } from '../theme/typography'
const inputTheme = {
  roundness: 8,
  animation: {
    scale: 0,
  },
}
export function AppFormField({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        mode="outlined"
        placeholder={`Enter ${label.toLowerCase()}`}
        style={styles.input}
        contentStyle={styles.inputContent}
        outlineStyle={styles.inputOutline}
        theme={inputTheme}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: fontSize.lg,
  },
  inputContent: {
    paddingVertical: 14,
    minHeight: 28,
  },
  inputOutline: {
    borderRadius: 8,
  },
})