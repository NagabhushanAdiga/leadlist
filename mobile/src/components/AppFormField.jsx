import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from 'react-native-paper'
import { useAppTheme } from '../context/ThemeContext'
import { fontSize } from '../theme/typography'

const inputTheme = {
  roundness: 8,
  animation: {
    scale: 0,
  },
}

export function AppFormField({ label, ...props }) {
  const { colors } = useAppTheme()

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        mode="outlined"
        placeholder={`Enter ${label.toLowerCase()}`}
        style={[styles.input, { backgroundColor: colors.inputBg }]}
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
    marginBottom: 8,
  },
  input: {
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
