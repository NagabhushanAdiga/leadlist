import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { gradients } from '../../theme'
import { fontSize } from '../../theme/typography'

export function HomeWelcomeBanner({ name }) {
  return (
    <LinearGradient colors={gradients.auth} style={styles.banner}>
      <Text style={styles.label}>Welcome back</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.text}>
        Here&apos;s an overview of your leads and upcoming actions.
      </Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  banner: {
    margin: 20,
    marginBottom: 8,
    borderRadius: 20,
    padding: 22,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.md,
    marginBottom: 4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: 6,
  },
  text: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSize.md,
    lineHeight: 22,
  },
})
