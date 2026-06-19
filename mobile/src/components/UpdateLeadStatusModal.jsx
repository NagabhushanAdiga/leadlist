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
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Update Status</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.leadName}>{lead.name}</Text>
            <Text style={styles.subtitle}>Choose a new status for this lead</Text>

            <View style={styles.statusList}>
              {LEAD_STATUSES.map((item) => {
                const isSelected = selectedStatus === item.key
                return (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.statusChip,
                      isSelected && { borderColor: item.color, backgroundColor: `${item.color}14` },
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
                    <Text style={[styles.statusText, isSelected && { color: item.color }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            {requiresRejectionReason(selectedStatus) ? (
              <View style={styles.reasonSection}>
                <Text style={styles.sectionLabel}>Select reason</Text>
                <View style={styles.reasonList}>
                  {LOAN_REJECTION_REASONS.map((item) => {
                    const isSelected = selectedReason === item.key
                    return (
                      <Pressable
                        key={item.key}
                        style={[
                          styles.reasonChip,
                          isSelected && styles.reasonChipSelected,
                        ]}
                        onPress={() => {
                          setSelectedReason(item.key)
                          setError('')
                        }}
                      >
                        <Text
                          style={[
                            styles.reasonText,
                            isSelected && styles.reasonTextSelected,
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
                <Text style={styles.sectionLabel}>{getFollowUpDateLabel(selectedStatus)}</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(followUpDate)}</Text>
                </Pressable>
                {requiresReminders(selectedStatus) ? (
                  <Text style={styles.reminderHint}>
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

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor="#6B7280">
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
    backgroundColor: '#FFFFFF',
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
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: '#6B7280',
    marginBottom: 16,
  },
  statusList: {
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#1A1A2E',
    flex: 1,
  },
  reasonSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  reasonList: {
    gap: 8,
  },
  reasonChip: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFBFF',
  },
  reasonChipSelected: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  reasonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  reasonTextSelected: {
    color: '#DC2626',
  },
  dateSection: {
    marginTop: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FAFBFF',
  },
  dateButtonText: {
    fontSize: fontSize.md,
    color: '#1A1A2E',
    fontWeight: '600',
  },
  reminderHint: {
    marginTop: 10,
    fontSize: fontSize.sm,
    color: '#6B7280',
    lineHeight: 20,
  },
  error: {
    marginTop: 12,
    fontSize: fontSize.sm,
    color: '#EF4444',
  },
})