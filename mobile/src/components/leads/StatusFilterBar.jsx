import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { LEAD_STATUSES } from '../../constants/leadStatuses'
import { useAppTheme } from '../../context/ThemeContext'
import { StatusFilterChip } from './StatusFilterChip'

export function StatusFilterBar({ activeFilter, onSelect, leads }) {
  const { colors } = useAppTheme()
  const countsByStatus = useMemo(() => {
    return leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {})
  }, [leads])

  return (
    <View
      style={[
        styles.filterBarWrap,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        <StatusFilterChip
          label="All"
          count={leads.length}
          active={activeFilter === 'All'}
          onPress={() => onSelect('All')}
        />
        {LEAD_STATUSES.map((item) => (
          <StatusFilterChip
            key={item.key}
            label={item.label}
            count={countsByStatus[item.key] || 0}
            color={item.color}
            active={activeFilter === item.key}
            onPress={() => onSelect(item.key)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  filterBarWrap: {
    borderBottomWidth: 1,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
})
