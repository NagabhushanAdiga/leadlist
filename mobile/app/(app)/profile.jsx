import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, Text } from 'react-native-paper';
import { ProfileScreenSkeleton } from '../../src/components/ScreenSkeletons';
import { useAuth } from '../../src/context/AuthContext';
import { useAppTheme } from '../../src/context/ThemeContext';
import { useScreenLoading } from '../../src/hooks/useScreenLoading';
import { fontSize } from '../../src/theme/typography';

const profileDetails = [
  { icon: 'email-outline', label: 'Email', valueKey: 'email' },
  { icon: 'phone-outline', label: 'Mobile', valueKey: 'mobile' },
  { icon: 'briefcase-outline', label: 'Role', valueKey: 'role' },
  { icon: 'office-building-outline', label: 'Company', valueKey: 'company' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const loading = useScreenLoading();

  if (loading) {
    return <ProfileScreenSkeleton />;
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.headerCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Avatar.Text
          size={88}
          label={user?.name?.charAt(0).toUpperCase() || 'U'}
          style={[styles.avatar, { backgroundColor: colors.primary }]}
        />
        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
        <Button
          mode="contained"
          icon="account-edit-outline"
          onPress={() => router.push('/(app)/profile-edit')}
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          contentStyle={styles.editButtonContent}
          labelStyle={styles.editButtonLabel}
          theme={{ roundness: 8 }}
        >
          Edit Profile
        </Button>
      </View>

      <View style={[styles.detailsCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Details</Text>
        <Divider style={styles.divider} />

        {profileDetails.map((item, index) => {
          const value = item.valueKey ? user?.[item.valueKey] : item.value;

          return (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
                </View>
              </View>
              {index < profileDetails.length - 1 ? (
                <Divider style={[styles.rowDivider, { backgroundColor: colors.border }]} />
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: fontSize.md,
    marginBottom: 16,
  },
  editButton: {
    borderRadius: 8,
  },
  editButtonContent: {
    paddingVertical: 4,
  },
  editButtonLabel: {
    fontWeight: '700',
  },
  detailsCard: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  rowDivider: {
    backgroundColor: 'transparent',
  },
});
