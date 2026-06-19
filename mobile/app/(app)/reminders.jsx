import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { getReminderDayLabel, getStatusDatePrefix, REMINDER_STATUSES } from '../../src/constants/leadStatuses';
import { useAppTheme } from '../../src/context/ThemeContext';
import { fontSize } from '../../src/theme/typography';
import { useScreenLoading } from '../../src/hooks/useScreenLoading';
import { getLeads } from '../../src/services/leadStorage';
import { formatPhone, handleCall } from '../../src/utils/leadFormat';

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

function ReminderCard({ lead, colors, onCallFeedback }) {
  const daysUntil = getDaysUntil(lead.followUpDate);
  const reminders = getUpcomingReminders(lead.followUpDate, lead.status);
  const dateLabel = getStatusDatePrefix(lead.status);
  const hasPhone = Boolean(String(lead.phone || '').trim());

  const onCallPress = async () => {
    const result = await handleCall(lead.phone);

    if (!result.ok && onCallFeedback) {
      onCallFeedback(result.message);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{lead.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.name, { color: colors.text }]}>{lead.name}</Text>
          <Text style={[styles.company, { color: colors.textSecondary }]}>{lead.company}</Text>
          {lead.phone ? (
            <Text style={[styles.phone, { color: colors.textSecondary }]}>
              {formatPhone(lead.phone)}
            </Text>
          ) : null}
        </View>
        <View style={[styles.daysBadge, { backgroundColor: colors.infoSoft }]}>
          <Text style={[styles.daysBadgeText, { color: colors.info }]}>
            {getDaysUntilLabel(daysUntil)}
          </Text>
        </View>
      </View>

      <View style={[styles.followUpRow, { borderTopColor: colors.border }]}>
        <MaterialCommunityIcons name="calendar-clock" size={18} color={colors.info} />
        <Text style={[styles.followUpDate, { color: colors.info }]}>
          {dateLabel} {formatDate(lead.followUpDate)}
        </Text>
      </View>

      <View style={styles.reminderList}>
        <Text style={[styles.reminderTitle, { color: colors.text }]}>Scheduled reminders</Text>
        {reminders.length > 0 ? (
          reminders.map((item) => (
            <View key={item.offset} style={styles.reminderRow}>
              <MaterialCommunityIcons name="bell-outline" size={16} color={colors.primary} />
              <Text style={[styles.reminderText, { color: colors.textSecondary }]}>
                {item.label} at 9:00 AM
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.noRemindersText, { color: colors.textMuted }]}>
            All reminders for this follow-up have passed.
          </Text>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.callButton,
          {
            backgroundColor: hasPhone ? colors.primary : colors.borderStrong,
            opacity: pressed ? 0.85 : hasPhone ? 1 : 0.55,
          },
        ]}
        onPress={onCallPress}
        disabled={!hasPhone}
      >
        <MaterialCommunityIcons name="phone" size={18} color={colors.onPrimary} />
        <Text style={[styles.callButtonText, { color: colors.onPrimary }]}>Call</Text>
      </Pressable>
    </View>
  );
}

function EmptyReminders({ colors }) {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="bell-off-outline" size={56} color={colors.disabled} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No reminders yet</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Set a lead status to Follow up, Call back, or Appointment fixed with a date in Leads List to see reminders here.
      </Text>
    </View>
  );
}

export default function RemindersScreen() {
  const { colors } = useAppTheme();
  const loading = useScreenLoading(600);
  const [reminders, setReminders] = useState([]);
  const [callMessage, setCallMessage] = useState('');

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
      <View style={[styles.loadingWrap, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading reminders...</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.list,
          reminders.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyReminders colors={colors} />}
        renderItem={({ item }) => (
          <ReminderCard
            lead={item}
            colors={colors}
            onCallFeedback={setCallMessage}
          />
        )}
      />
      {callMessage ? (
        <Snackbar visible onDismiss={() => setCallMessage('')} duration={3500}>
          {callMessage}
        </Snackbar>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    paddingBottom: 32,
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
  },
  loadingText: {
    fontSize: fontSize.md,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  company: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  phone: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysBadgeText: {
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
  },
  followUpDate: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  reminderList: {
    marginTop: 14,
    gap: 8,
  },
  reminderTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: 4,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderText: {
    fontSize: fontSize.sm,
  },
  noRemindersText: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 14,
  },
  callButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
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
});
