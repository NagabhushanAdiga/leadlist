import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function LeadsEmptyState({ activeFilter }) {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="filter-off-outline" size={56} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No leads found</Text>
      <Text style={styles.emptyText}>
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
    color: '#1A1A2E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
})
