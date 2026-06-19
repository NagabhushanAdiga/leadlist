import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function HomeQuickActionCard({ title, subtitle, icon, color, bg, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { backgroundColor: bg }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
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
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: '#6B7280',
    lineHeight: 20,
  },
})
