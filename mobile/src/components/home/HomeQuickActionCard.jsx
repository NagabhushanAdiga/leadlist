import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function HomeQuickActionCard({ title, subtitle, icon, color, bg, onPress, colors, isDark }) {
  const cardBg = isDark ? `${color}22` : bg

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { backgroundColor: cardBg }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
  },
  pressed: {
    opacity: 0.88,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
})
