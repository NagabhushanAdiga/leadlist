import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import {
  LOAN_NOT_APPROVED_STATUS,
  getStatusDatePrefix,
  requiresFollowUpDate,
} from '../../constants/leadStatuses'
import { fontSize } from '../../theme/typography'
import { formatFollowUpDate, formatPhone, handleCall } from '../../utils/leadFormat'

export function LeadCard({ lead, onUpdateStatus }) {
  const { name, email, phone, company, role, status, statusColor, followUpDate, rejectionReason } =
    lead

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(name || '?').charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.company}>{company}</Text>
        </View>
        <Pressable
          style={[styles.badge, { backgroundColor: `${statusColor}18` }]}
          onPress={() => onUpdateStatus(lead)}
        >
          <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
        </Pressable>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="email-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{email}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="phone-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{formatPhone(phone)}</Text>
        </View>
        {requiresFollowUpDate(status) && followUpDate ? (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar-clock" size={16} color="#0EA5E9" />
            <Text style={styles.followUpText}>
              {getStatusDatePrefix(status)} {formatFollowUpDate(followUpDate)}
            </Text>
          </View>
        ) : null}
        {status === LOAN_NOT_APPROVED_STATUS && rejectionReason ? (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#DC2626" />
            <Text style={styles.rejectionText}>Reason: {rejectionReason}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => onUpdateStatus(lead)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={18} color="#6C63FF" />
          <Text style={styles.secondaryButtonText}>Update Status</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.callButton, pressed && styles.buttonPressed]}
          onPress={() => handleCall(phone)}
        >
          <MaterialCommunityIcons name="phone" size={18} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Call</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    paddingRight: 8,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  role: {
    fontSize: fontSize.sm,
    color: '#6C63FF',
    marginTop: 2,
    fontWeight: '500',
  },
  company: {
    fontSize: fontSize.sm,
    color: '#6B7280',
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
    borderTopColor: '#F0F1F8',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: '#6B7280',
    flex: 1,
  },
  followUpText: {
    fontSize: fontSize.sm,
    color: '#0EA5E9',
    fontWeight: '600',
    flex: 1,
  },
  rejectionText: {
    fontSize: fontSize.sm,
    color: '#DC2626',
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
    borderColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#6C63FF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 12,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
})
