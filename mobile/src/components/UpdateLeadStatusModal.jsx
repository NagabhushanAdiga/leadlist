import DateTimePicker from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import {
  FOLLOW_UP_STATUS,
  LEAD_STATUSES,
  LOAN_REJECTION_REASONS,
  getFollowUpDateLabel,
  getReminderDayLabel,
  requiresFollowUpDate,
  requiresRejectionReason,
  requiresReminders,
} from '../constants/leadStatuses'
import { useAppTheme } from '../context/ThemeContext'
import { fontSize } from '../theme/typography'

function getDefaultFollowUpDate() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function UpdateLeadStatusModal({
  visible,
  lead,
  onDismiss,
  onSave,
  saving,
}) {
  const { colors } = useAppTheme()
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || FOLLOW_UP_STATUS)
  const [selectedReason, setSelectedReason] = useState(null)
  const [followUpDate, setFollowUpDate] = useState(getDefaultFollowUpDate())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!lead) {
      return
    }

    setSelectedStatus(lead.status)
    setSelectedReason(lead.rejectionReason || null)
    setFollowUpDate(lead.followUpDate ? new Date(lead.followUpDate) : getDefaultFollowUpDate())
    setError('')
    setShowDatePicker(false)
  }, [lead, visible])

  const handleSave = () => {
    if (requiresFollowUpDate(selectedStatus)) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (followUpDate < today) {
        setError('Please select today or a future date.')
        return
      }
    }

    if (requiresRejectionReason(selectedStatus) && !selectedReason) {
      setError('Please select a reason for loan not approved.')
      return
    }

    onSave({
      status: selectedStatus,
      followUpDate: requiresFollowUpDate(selectedStatus)
        ? followUpDate.toISOString()
        : null,
      rejectionReason: requiresRejectionReason(selectedStatus) ? selectedReason : null,
    })
  }

  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    if (event.type === 'dismissed' || !date) {
      return
    }

    setFollowUpDate(date)
    setError('')
  }

  if (!lead) {
    return null
  }

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={[styles.dialog, { backgroundColor: colors.surface }]}
      >
        <Dialog.Title>Update Status</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.leadName, { color: colors.text }]}>{lead.name}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Choose a new status for this lead
            </Text>

            <View style={styles.statusList}>
              {LEAD_STATUSES.map((item) => {
                const isSelected = selectedStatus === item.key
                return (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.statusChip,
                      {
                        borderColor: isSelected ? item.color : colors.borderStrong,
                        backgroundColor: isSelected ? `${item.color}14` : colors.chipBg,
                      },
                    ]}
                    onPress={() => {
                      setSelectedStatus(item.key)
                      if (!requiresRejectionReason(item.key)) {
                        setSelectedReason(null)
                      }
                      setError('')
                    }}
                  >
                    <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.statusText, { color: isSelected ? item.color : colors.text }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            {requiresRejectionReason(selectedStatus) ? (
              <View style={styles.reasonSection}>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>Select reason</Text>
                <View style={styles.reasonList}>
                  {LOAN_REJECTION_REASONS.map((item) => {
                    const isSelected = selectedReason === item.key
                    return (
                      <Pressable
                        key={item.key}
                        style={[
                          styles.reasonChip,
                          {
                            borderColor: isSelected ? colors.danger : colors.borderStrong,
                            backgroundColor: isSelected ? colors.dangerSoft : colors.dropZoneBg,
                          },
                        ]}
                        onPress={() => {
                          setSelectedReason(item.key)
                          setError('')
                        }}
                      >
                        <Text
                          style={[
                            styles.reasonText,
                            { color: isSelected ? colors.danger : colors.text },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            ) : null}

            {requiresFollowUpDate(selectedStatus) ? (
              <View style={styles.dateSection}>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>
                  {getFollowUpDateLabel(selectedStatus)}
                </Text>
                <Pressable
                  style={[
                    styles.dateButton,
                    {
                      borderColor: colors.borderStrong,
                      backgroundColor: colors.dropZoneBg,
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: colors.text }]}>
                    {formatDate(followUpDate)}
                  </Text>
                </Pressable>
                {requiresReminders(selectedStatus) ? (
                  <Text style={[styles.reminderHint, { color: colors.textSecondary }]}>
                    You will get reminders 3 days before, 2 days before, 1 day before, and on the{' '}
                    {getReminderDayLabel(selectedStatus)} day.
                  </Text>
                ) : null}

                {showDatePicker ? (
                  <DateTimePicker
                    value={followUpDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={onDateChange}
                  />
                ) : null}
              </View>
            ) : null}

            {error ? <Text style={[styles.error, { color: colors.dangerText }]}>{error}</Text> : null}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.textSecondary}>
            Cancel
          </Button>
          <Button onPress={handleSave} loading={saving} disabled={saving}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    maxHeight: '88%',
  },
  scrollArea: {
    paddingHorizontal: 0,
    maxHeight: 480,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  leadName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginBottom: 16,
  },
  statusList: {
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  reasonSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: 8,
  },
  reasonList: {
    gap: 8,
  },
  reasonChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reasonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  dateSection: {
    marginTop: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dateButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  reminderHint: {
    marginTop: 10,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  error: {
    marginTop: 12,
    fontSize: fontSize.sm,
  },
})
