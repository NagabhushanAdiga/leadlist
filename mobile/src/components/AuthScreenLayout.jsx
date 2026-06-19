import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppTheme } from '../context/ThemeContext'
import { gradients } from '../theme'

export function AuthScreenLayout({ title, subtitle, children, footer }) {
  const insets = useSafeAreaInsets()
  const { colors } = useAppTheme()
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true))
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <LinearGradient
        colors={gradients.auth}
        style={[
          styles.topSection,
          keyboardVisible ? styles.topSectionCompact : styles.topSectionExpanded,
          { paddingTop: insets.top + (keyboardVisible ? 12 : 24) },
        ]}
      >
        <View style={styles.headerContent}>
          {!keyboardVisible ? (
            <>
              <Text variant="headlineMedium" style={styles.title}>
                {title}
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                {subtitle}
              </Text>
            </>
          ) : (
            <Text variant="titleLarge" style={styles.titleCompact}>
              {title}
            </Text>
          )}
        </View>
      </LinearGradient>

      <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.formContent,
            {
              paddingBottom: keyboardVisible ? insets.bottom + 120 : insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topSection: {
    justifyContent: 'center',
  },
  topSectionExpanded: {
    flex: 0.34,
  },
  topSectionCompact: {
    flex: 0,
    paddingBottom: 16,
  },
  formSection: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  titleCompact: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
  },
  formContent: {
    flexGrow: 1,
    paddingTop: 28,
  },
  footer: {
    marginTop: 8,
  },
})
