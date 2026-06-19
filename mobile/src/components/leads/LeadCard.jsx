import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import {
  LOAN_NOT_APPROVED_STATUS,
  getStatusDatePrefix,
  requiresFollowUpDate,
} from '../../constants/leadStatuses'
import { useAppTheme } from '../../context/ThemeContext'
import { fontSize } from '../../theme/typography'
import { formatFollowUpDate, formatPhone, handleCall } from '../../utils/leadFormat'

export function LeadCard({ lead, onUpdateStatus, onCallFeedback }) {
  const { colors } = useAppTheme()
  const { name, email, phone, company, role, status, statusColor, followUpDate, rejectionReason } =
    lead
  const hasPhone = Boolean(String(phone || '').trim())

  const onCallPress = async () => {
    const result = await handleCall(phone)

    if (!result.ok && onCallFeedback) {
      onCallFeedback(result.message)
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {(name || '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.role, { color: colors.primary }]}>{role}</Text>
          <Text style={[styles.company, { color: colors.textSecondary }]}>{company}</Text>
        </View>
        <Pressable
          style={[styles.badge, { backgroundColor: `${statusColor}18` }]}
          onPress={() => onUpdateStatus(lead)}
        >
          <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
        </Pressable>
      </View>

      <View style={[styles.details, { borderTopColor: colors.border }]}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="email-outline" size={16} color={colors.iconMuted} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{email}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="phone-outline" size={16} color={colors.iconMuted} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formatPhone(phone)}
          </Text>
        </View>
        {requiresFollowUpDate(status) && followUpDate ? (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar-clock" size={16} color={colors.info} />
            <Text style={[styles.followUpText, { color: colors.info }]}>
              {getStatusDatePrefix(status)} {formatFollowUpDate(followUpDate)}
            </Text>
          </View>
        ) : null}
        {status === LOAN_NOT_APPROVED_STATUS && rejectionReason ? (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.danger} />
            <Text style={[styles.rejectionText, { color: colors.danger }]}>
              Reason: {rejectionReason}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onUpdateStatus(lead)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Update Status</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.callButton,
            { backgroundColor: hasPhone ? colors.primary : colors.borderStrong },
            pressed && styles.buttonPressed,
            !hasPhone && styles.callButtonDisabled,
          ]}
          onPress={onCallPress}
          disabled={!hasPhone}
        >
          <MaterialCommunityIcons name="phone" size={18} color={colors.onPrimary} />
          <Text style={[styles.callButtonText, { color: colors.onPrimary }]}>Call</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    paddingRight: 8,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  role: {
    fontSize: fontSize.sm,
    marginTop: 2,
    fontWeight: '500',
  },
  company: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: '42%',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  details: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  followUpText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  rejectionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    paddingVertical: 12,
  },
  callButtonDisabled: {
    opacity: 0.55,
  },
  callButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
})
