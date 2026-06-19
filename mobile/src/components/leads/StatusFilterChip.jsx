import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function StatusFilterChip({ label, count, color, active, onPress }) {
  const accent = color || '#6C63FF'

  return (
    <Pressable
      style={[
        styles.filterChip,
        active && { borderColor: accent, backgroundColor: `${accent}14` },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, active && { color: accent }]}>
        {label}
      </Text>
      <View style={[styles.filterCount, active && { backgroundColor: accent }]}>
        <Text style={[styles.filterCountText, active && styles.filterCountTextActive]}>
          {count}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#1A1A2E',
    marginRight: 8,
  },
  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterCountText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
})
