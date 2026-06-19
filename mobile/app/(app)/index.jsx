import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import {
  HomeQuickActionCard,
  HomeStatCard,
  HomeWelcomeBanner,
} from '../../src/components/home'
import { HomeScreenSkeleton } from '../../src/components/ScreenSkeletons'
import { HOME_QUICK_ACTIONS } from '../../src/constants/homeQuickActions'
import { useAuth } from '../../src/context/AuthContext'
import { useAppTheme } from '../../src/context/ThemeContext'
import { useHomeScreen } from '../../src/hooks/useHomeScreen'
import { fontSize } from '../../src/theme/typography'

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const { initialLoading, loadingLeads, stats } = useHomeScreen()

  if (initialLoading || loadingLeads) {
    return <HomeScreenSkeleton />
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HomeWelcomeBanner name={user?.name} />

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <View key={item.id} style={styles.statWrap}>
            <HomeStatCard {...item} />
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsRow}
      >
        {HOME_QUICK_ACTIONS.map((action) => (
          <HomeQuickActionCard
            key={action.id}
            title={action.title}
            subtitle={action.subtitle}
            icon={action.icon}
            color={action.color}
            bg={action.bg}
            onPress={() => router.push(action.href)}
          />
        ))}
      </ScrollView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginTop: 8,
  },
  statWrap: {
    width: '50%',
    padding: 6,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  actionsRow: {
    paddingHorizontal: 20,
  },
})
