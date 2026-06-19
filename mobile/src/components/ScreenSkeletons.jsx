import { ScrollView, StyleSheet, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext'
import { ShimmerBox } from './Shimmer'

export function HomeScreenSkeleton() {
  const { colors } = useAppTheme()

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <ShimmerBox height={120} borderRadius={20} style={styles.banner} />

      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.statWrap}>
            <ShimmerBox height={130} borderRadius={18} />
          </View>
        ))}
      </View>

      <ShimmerBox width={140} height={18} style={styles.sectionTitle} />
      <View style={styles.actionsRow}>
        {[1, 2, 3].map((item) => (
          <ShimmerBox key={item} width={140} height={120} borderRadius={18} />
        ))}
      </View>

      <ShimmerBox height={220} borderRadius={20} style={styles.recentCard} />
    </ScrollView>
  )
}

export function LeadsScreenSkeleton() {
  const { colors } = useAppTheme()

  return (
    <View style={[styles.leadsList, { backgroundColor: colors.background }]}>
      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={[styles.leadCard, { backgroundColor: colors.card }]}>
          <View style={styles.leadTop}>
            <ShimmerBox width={46} height={46} borderRadius={14} />
            <View style={styles.leadInfo}>
              <ShimmerBox height={16} style={styles.mb8} />
              <ShimmerBox width="70%" height={13} style={styles.mb8} />
              <ShimmerBox width="50%" height={13} />
            </View>
          </View>
          <ShimmerBox height={40} borderRadius={8} style={styles.mt14} />
          <ShimmerBox height={44} borderRadius={8} style={styles.mt14} />
        </View>
      ))}
    </View>
  )
}

export function ProfileScreenSkeleton() {
  const { colors } = useAppTheme()

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <ShimmerBox width={88} height={88} borderRadius={44} style={styles.mb16} />
        <ShimmerBox width={160} height={22} style={styles.mb8} />
        <ShimmerBox width={200} height={14} />
      </View>

      <View style={[styles.profileDetails, { backgroundColor: colors.card }]}>
        <ShimmerBox width={120} height={16} style={styles.mb16} />
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.detailRow}>
            <ShimmerBox width={40} height={40} borderRadius={12} />
            <View style={styles.detailInfo}>
              <ShimmerBox width={60} height={12} style={styles.mb8} />
              <ShimmerBox width="80%" height={15} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  banner: {
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statWrap: {
    width: '50%',
    padding: 6,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recentCard: {
    marginTop: 20,
  },
  leadsList: {
    padding: 20,
    flex: 1,
  },
  leadCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  leadTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileHeader: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileDetails: {
    borderRadius: 20,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailInfo: {
    flex: 1,
    marginLeft: 14,
  },
  mb8: {
    marginBottom: 8,
  },
  mb16: {
    marginBottom: 16,
  },
  mt14: {
    marginTop: 14,
  },
})
