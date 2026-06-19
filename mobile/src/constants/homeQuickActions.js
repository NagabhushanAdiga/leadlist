import { DRAWER_MENU_ITEMS } from './drawerMenu'

const ACTION_META = {
  '/(app)/profile': {
    subtitle: 'View your account details',
    color: '#6C63FF',
    bg: '#EEF0FF',
  },
  '/(app)/leads': {
    subtitle: 'Browse and manage leads',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  '/(app)/reminders': {
    subtitle: 'Upcoming follow-ups',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  '/(app)/upload': {
    subtitle: 'Import lead spreadsheet',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  '/(app)/feedback': {
    subtitle: 'Share bugs and suggestions',
    color: '#F97316',
    bg: '#FFEDD5',
  },
  '/(app)/settings': {
    subtitle: 'Theme and preferences',
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
}

export const HOME_QUICK_ACTIONS = DRAWER_MENU_ITEMS.filter(
  (item) => item.href !== '/(app)',
).map((item) => ({
  id: item.href,
  title: item.label,
  href: item.href,
  icon: item.icon,
  ...ACTION_META[item.href],
}))
