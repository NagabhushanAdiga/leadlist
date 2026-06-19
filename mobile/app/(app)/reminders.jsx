import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getReminderDayLabel, getStatusDatePrefix, REMINDER_STATUSES } from '../../src/constants/leadStatuses';
import { fontSize } from '../../src/theme/typography';
import { useScreenLoading } from '../../src/hooks/useScreenLoading';
import { getLeads } from '../../src/services/leadStorage';

const REMINDER_OFFSETS = [3, 2, 1, 0];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDaysUntilLabel(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`;
  return `In ${days} days`;
}

function getUpcomingReminders(followUpDate, status) {
  const daysUntil = getDaysUntil(followUpDate);
  const dayLabel = getReminderDayLabel(status);

  return REMINDER_OFFSETS.filter((offset) => daysUntil >= offset).map((offset) => ({
    offset,
    label:
      offset === 0
        ? `On ${dayLabel} day`
        : `${offset} day${offset > 1 ? 's' : ''} before`,
  }));
}

function ReminderCard({ lead }) {
  const daysUntil = getDaysUntil(lead.followUpDate);
  const reminders = getUpcomingReminders(lead.followUpDate, lead.status);
  const dateLabel = getStatusDatePrefix(lead.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{lead.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.company}>{lead.company}</Text>
        </View>
        <View style={styles.daysBadge}>
          <Text style={styles.daysBadgeText}>{getDaysUntilLabel(daysUntil)}</Text>
        </View>
      </View>

      <View style={styles.followUpRow}>
        <MaterialCommunityIcons name="calendar-clock" size={18} color="#0EA5E9" />
        <Text style={styles.followUpDate}>
          {dateLabel} {formatDate(lead.followUpDate)}
        </Text>
      </View>

      <View style={styles.reminderList}>
        <Text style={styles.reminderTitle}>Scheduled reminders</Text>
        {reminders.length > 0 ? (
          reminders.map((item) => (
            <View key={item.offset} style={styles.reminderRow}>
              <MaterialCommunityIcons name="bell-outline" size={16} color="#6C63FF" />
              <Text style={styles.reminderText}>{item.label} at 9:00 AM</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noRemindersText}>All reminders for this follow-up have passed.</Text>
        )}
      </View>
    </View>
  );
}

function EmptyReminders() {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="bell-off-outline" size={56} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No reminders yet</Text>
      <Text style={styles.emptyText}>
        Set a lead status to Follow up, Call back, or Appointment fixed with a date in Leads List to see reminders here.
      </Text>
    </View>
  );
}

export default function RemindersScreen() {
  const loading = useScreenLoading(600);
  const [reminders, setReminders] = useState([]);

  const loadReminders = useCallback(async () => {
    const leads = await getLeads();
    const followUps = leads
      .filter((lead) => REMINDER_STATUSES.includes(lead.status) && lead.followUpDate)
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

    setReminders(followUps);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [loadReminders]),
  );

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loadingText}>Loading reminders...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reminders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.list,
        reminders.length === 0 && styles.listEmpty,
      ]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyReminders />}
      renderItem={({ item }) => <ReminderCard lead={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#F8F9FE',
    flexGrow: 1,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FE',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: fontSize.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#6C63FF',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  company: {
    fontSize: fontSize.sm,
    color: '#6B7280',
    marginTop: 2,
  },
  daysBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysBadgeText: {
    color: '#0EA5E9',
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  followUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F8',
  },
  followUpDate: {
    fontSize: fontSize.md,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  reminderList: {
    marginTop: 14,
    gap: 8,
  },
  reminderTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderText: {
    fontSize: fontSize.sm,
    color: '#6B7280',
  },
  noRemindersText: {
    fontSize: fontSize.sm,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
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
});
