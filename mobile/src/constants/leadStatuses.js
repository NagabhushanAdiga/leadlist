export const LEAD_STATUSES = [
  { key: 'Follow up', label: 'Follow up', color: '#0EA5E9' },
  { key: 'Customer not responding', label: 'Customer not responding', color: '#EF4444' },
  { key: 'Call back', label: 'Call back', color: '#F59E0B' },
  { key: 'Appointment fixed', label: 'Appointment fixed', color: '#8B5CF6' },
  { key: 'Loan disbursed', label: 'Loan disbursed', color: '#10B981' },
  { key: 'Loan not approved', label: 'Loan not approved', color: '#DC2626' },
]
export const LOAN_REJECTION_REASONS = [
  { key: 'Vintage issue', label: 'Vintage issue' },
  { key: 'CIBIL issue', label: 'CIBIL issue' },
  { key: 'Missing documents', label: 'Missing documents' },
]
export const FOLLOW_UP_STATUS = 'Follow up'
export const CALLBACK_STATUS = 'Call back'
export const CUSTOMER_NOT_RESPONDING_STATUS = 'Customer not responding'
export const APPOINTMENT_FIXED_STATUS = 'Appointment fixed'
export const LOAN_DISBURSED_STATUS = 'Loan disbursed'
export const LOAN_NOT_APPROVED_STATUS = 'Loan not approved'
export const DATE_REQUIRED_STATUSES = [
  FOLLOW_UP_STATUS,
  CALLBACK_STATUS,
  APPOINTMENT_FIXED_STATUS,
]
export const REMINDER_STATUSES = [
  FOLLOW_UP_STATUS,
  CALLBACK_STATUS,
  APPOINTMENT_FIXED_STATUS,
]
export function requiresFollowUpDate(status) {
  return DATE_REQUIRED_STATUSES.includes(status)
}

export function requiresReminders(status) {
  return REMINDER_STATUSES.includes(status)
}

export function requiresRejectionReason(status) {
  return status === LOAN_NOT_APPROVED_STATUS
}

export function getStatusColor(status) {
  return LEAD_STATUSES.find((item) => item.key === status)?.color || '#6B7280'
}

export function getFollowUpDateLabel(status) {
  if (status === CALLBACK_STATUS) {
    return 'Call back date'
  }

  if (status === APPOINTMENT_FIXED_STATUS) {
    return 'Appointment date'
  }

  return 'Follow-up date'
}

export function getStatusDatePrefix(status) {
  if (status === CALLBACK_STATUS) {
    return 'Call back on'
  }

  if (status === APPOINTMENT_FIXED_STATUS) {
    return 'Appointment on'
  }

  return 'Follow-up on'
}

export function getReminderDayLabel(status) {
  if (status === CALLBACK_STATUS) {
    return 'call back'
  }

  if (status === APPOINTMENT_FIXED_STATUS) {
    return 'appointment'
  }

  return 'follow-up'
}

export function getStatusSaveLabel(status) {
  if (status === CALLBACK_STATUS) {
    return 'Call back'
  }

  if (status === APPOINTMENT_FIXED_STATUS) {
    return 'Appointment'
  }

  return 'Follow-up'
}
