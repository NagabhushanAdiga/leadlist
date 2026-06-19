import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useAppTheme } from '../../context/ThemeContext'

export function FormScreenLayout({ children, snackbar }) {
  const { colors } = useAppTheme()

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          {children}
        </View>
      </ScrollView>
      {snackbar}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
})
