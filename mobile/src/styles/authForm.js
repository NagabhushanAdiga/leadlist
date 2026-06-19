import { StyleSheet } from 'react-native'
import { fontSize } from '../theme/typography'

export const authFormStyles = StyleSheet.create({
  field: {
    marginBottom: 14,
    marginHorizontal: 24,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: fontSize.lg,
  },
  inputContent: {
    paddingVertical: 18,
    minHeight: 32,
  },
  inputOutline: {
    borderRadius: 8,
  },
  error: {
    marginHorizontal: 24,
  },
  button: {
    marginTop: 8,
    marginHorizontal: 24,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 24,
  },
  footerText: {
    color: '#6B7280',
  },
  link: {
    color: '#6C63FF',
    fontWeight: '700',
  },
})
