import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useAppTheme } from '../../context/ThemeContext'
import { fontSize } from '../../theme/typography'

export function StatusFilterChip({ label, count, color, active, onPress }) {
  const { colors } = useAppTheme()
  const accent = color || colors.primary

  return (
    <Pressable
      style={[
        styles.filterChip,
        {
          borderColor: active ? accent : colors.borderStrong,
          backgroundColor: active ? `${accent}14` : colors.chipBg,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, { color: active ? accent : colors.text }]}>
        {label}
      </Text>
      <View style={[styles.filterCount, { backgroundColor: active ? accent : colors.chipCountBg }]}>
        <Text
          style={[
            styles.filterCountText,
            { color: active ? colors.onPrimary : colors.textSecondary },
          ]}
        >
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
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginRight: 8,
  },
  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterCountText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
})
