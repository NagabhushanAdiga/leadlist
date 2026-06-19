import {
  CUSTOMER_NOT_RESPONDING_STATUS,
  LOAN_DISBURSED_STATUS,
  LOAN_NOT_APPROVED_STATUS,
  REMINDER_STATUSES,
} from '../constants/leadStatuses'

function countUpcomingReminders(leads) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return leads.filter((lead) => {
    if (!REMINDER_STATUSES.includes(lead.status) || !lead.followUpDate) {
      return false
    }

    const target = new Date(lead.followUpDate)
    target.setHours(0, 0, 0, 0)
    const daysUntil = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return daysUntil >= 0 && daysUntil <= 7
  }).length
}

export function buildHomeStats(leads) {
  const total = leads.length
  const activeFollowUps = leads.filter((lead) => REMINDER_STATUSES.includes(lead.status)).length
  const disbursed = leads.filter((lead) => lead.status === LOAN_DISBURSED_STATUS).length
  const needsAttention = leads.filter(
    (lead) =>
      lead.status === CUSTOMER_NOT_RESPONDING_STATUS ||
      lead.status === LOAN_NOT_APPROVED_STATUS,
  ).length
  const upcomingReminders = countUpcomingReminders(leads)

  return [
    {
      id: 'total',
      label: 'Total Leads',
      value: String(total),
      change: `${total} in your list`,
      icon: 'account-group-outline',
      colors: ['#6C63FF', '#8B5CF6'],
    },
    {
      id: 'followups',
      label: 'Active Follow-ups',
      value: String(activeFollowUps),
      change: 'Follow up, call back, appointments',
      icon: 'calendar-clock',
      colors: ['#0EA5E9', '#38BDF8'],
    },
    {
      id: 'disbursed',
      label: 'Loan Disbursed',
      value: String(disbursed),
      change: disbursed === 1 ? '1 converted lead' : `${disbursed} converted leads`,
      icon: 'check-circle-outline',
      colors: ['#10B981', '#34D399'],
    },
    {
      id: 'attention',
      label: 'Needs Attention',
      value: String(needsAttention),
      change:
        upcomingReminders > 0
          ? `${upcomingReminders} reminder${upcomingReminders > 1 ? 's' : ''} this week`
          : 'No urgent reminders',
      icon: 'bell-alert-outline',
      colors: ['#F59E0B', '#FBBF24'],
    },
  ]
}
