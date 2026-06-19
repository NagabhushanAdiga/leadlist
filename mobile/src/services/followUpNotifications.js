import AsyncStorage from '@react-native-async-storage/async-storage'
import { isRunningInExpoGo } from 'expo'
import {
  APPOINTMENT_FIXED_STATUS,
  CALLBACK_STATUS,
  FOLLOW_UP_STATUS,
  REMINDER_STATUSES,
} from '../constants/leadStatuses'
import { getLeads } from './leadStorage'

const NOTIFICATION_IDS_KEY = '@mobileappp/followup-notification-ids'
const REMINDER_HOUR = 9
const REMINDER_DAYS_BEFORE = [3, 2, 1, 0]

let notificationsModule = null
let notificationsInitialized = false

function getNotifications() {
  if (notificationsInitialized) {
    return notificationsModule
  }

  notificationsInitialized = true

  if (isRunningInExpoGo()) {
    return null
  }

  try {
    notificationsModule = require('expo-notifications')
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
  } catch {
    notificationsModule = null
  }

  return notificationsModule
}

function startOfReminderDay(date, daysBefore) {
  const reminderDate = new Date(date)
  reminderDate.setHours(REMINDER_HOUR, 0, 0, 0)
  reminderDate.setDate(reminderDate.getDate() - daysBefore)
  return reminderDate
}

function formatDisplayDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getReminderAction(status) {
  if (status === CALLBACK_STATUS) {
    return 'Call back with'
  }

  if (status === APPOINTMENT_FIXED_STATUS) {
    return 'Appointment with'
  }

  return 'Follow up with'
}

function getReminderTitle(status, daysBefore) {
  if (daysBefore === 0) {
    if (status === CALLBACK_STATUS) {
      return 'Call Back Today'
    }

    if (status === APPOINTMENT_FIXED_STATUS) {
      return 'Appointment Today'
    }

    return 'Follow-up Today'
  }

  if (status === CALLBACK_STATUS) {
    return 'Call Back Reminder'
  }

  if (status === APPOINTMENT_FIXED_STATUS) {
    return 'Appointment Reminder'
  }

  return 'Follow-up Reminder'
}

function getReminderMessage(leadName, daysBefore, followUpDate, status = FOLLOW_UP_STATUS) {
  const formattedDate = formatDisplayDate(followUpDate)
  const action = getReminderAction(status)
  if (daysBefore === 0) {
    return `${action} ${leadName} is scheduled for today (${formattedDate}).`
  }

  return `${action} ${leadName} is in ${daysBefore} day${daysBefore > 1 ? 's' : ''} (${formattedDate}).`
}

async function getStoredNotificationMap() {
  const stored = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY)
  return stored ? JSON.parse(stored) : {}
}

async function saveNotificationMap(map) {
  await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(map))
}

export async function requestNotificationPermissions() {
  const Notifications = getNotifications()
  if (!Notifications) {
    return false
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  if (existingStatus === 'granted') {
    return true
  }

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function cancelFollowUpReminders(leadId) {
  const Notifications = getNotifications()
  if (!Notifications) {
    return
  }

  const notificationMap = await getStoredNotificationMap()
  const ids = notificationMap[leadId] || []
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)))
  delete notificationMap[leadId]
  await saveNotificationMap(notificationMap)
}

export async function scheduleFollowUpReminders(leadId, leadName, followUpDate, status = 'Follow up') {
  const Notifications = getNotifications()
  if (!Notifications) {
    return 0
  }

  await cancelFollowUpReminders(leadId)
  const hasPermission = await requestNotificationPermissions()
  if (!hasPermission) {
    throw new Error('Notification permission is required for follow-up reminders.')
  }

  const followUp = new Date(followUpDate)
  followUp.setHours(0, 0, 0, 0)
  const now = new Date()
  const scheduledIds = []
  for (const daysBefore of REMINDER_DAYS_BEFORE) {
    const triggerDate = startOfReminderDay(followUp, daysBefore)
    if (triggerDate <= now) {
      continue
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: getReminderTitle(status, daysBefore),
        body: getReminderMessage(leadName, daysBefore, followUpDate, status),
        data: { leadId, followUpDate, status },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    })
    scheduledIds.push(notificationId)
  }

  const notificationMap = await getStoredNotificationMap()
  notificationMap[leadId] = scheduledIds
  await saveNotificationMap(notificationMap)
  return scheduledIds.length
}

export async function syncFollowUpRemindersFromStorage() {
  if (!getNotifications()) {
    return
  }

  const hasPermission = await requestNotificationPermissions()
  if (!hasPermission) {
    return
  }

  const leads = await getLeads()
  for (const lead of leads) {
    if (REMINDER_STATUSES.includes(lead.status) && lead.followUpDate) {
      await scheduleFollowUpReminders(lead.id, lead.name, lead.followUpDate, lead.status)
    }
  }
}
