import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, Text } from 'react-native-paper';
import { ProfileScreenSkeleton } from '../../src/components/ScreenSkeletons';
import { useAuth } from '../../src/context/AuthContext';
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
  const loading = useScreenLoading();

  if (loading) {
    return <ProfileScreenSkeleton />;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Avatar.Text
          size={88}
          label={user?.name?.charAt(0).toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Button
          mode="contained"
          icon="account-edit-outline"
          onPress={() => router.push('/(app)/profile-edit')}
          style={styles.editButton}
          contentStyle={styles.editButtonContent}
          labelStyle={styles.editButtonLabel}
          theme={{ roundness: 8 }}
        >
          Edit Profile
        </Button>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        <Divider style={styles.divider} />

        {profileDetails.map((item, index) => {
          const value = item.valueKey ? user?.[item.valueKey] : item.value;

          return (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name={item.icon} size={20} color="#6C63FF" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              </View>
              {index < profileDetails.length - 1 ? <Divider style={styles.rowDivider} /> : null}
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
    backgroundColor: '#F8F9FE',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    backgroundColor: '#6C63FF',
    marginBottom: 16,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  email: {
    fontSize: fontSize.md,
    color: '#6B7280',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
  },
  editButtonContent: {
    paddingVertical: 4,
  },
  editButtonLabel: {
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#1A1A2E',
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
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  rowDivider: {
    backgroundColor: '#F0F1F8',
  },
});
