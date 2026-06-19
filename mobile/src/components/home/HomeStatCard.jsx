import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function HomeStatCard({ label, value, change, icon, colors }) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.change} numberOfLines={2}>
        {change}
      </Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    minHeight: 130,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    color: '#FFFFFF',
    fontSize: fontSize.display,
    fontWeight: '700',
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  change: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: fontSize.sm,
    marginTop: 4,
  },
})
