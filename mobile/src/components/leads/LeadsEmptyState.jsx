import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useAppTheme } from '../../context/ThemeContext'
import { fontSize } from '../../theme/typography'

export function LeadsEmptyState({ activeFilter }) {
  const { colors } = useAppTheme()

  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="filter-off-outline" size={56} color={colors.disabled} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No leads found</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {activeFilter === 'All'
          ? 'No leads available.'
          : `No leads with "${activeFilter}" status.`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
})
