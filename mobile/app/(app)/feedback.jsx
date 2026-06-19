import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Snackbar, Text } from 'react-native-paper'
import { FormError, FormSubmitButton } from '../../src/components/forms'
import { useAppTheme } from '../../src/context/ThemeContext'
import { submitFeedback } from '../../src/services/feedbackService'
import { fontSize } from '../../src/theme/typography'

const CATEGORIES = [
  { key: 'bug', label: 'Bug report', icon: 'bug-outline' },
  { key: 'feature', label: 'Feature request', icon: 'lightbulb-outline' },
  { key: 'general', label: 'General', icon: 'message-text-outline' },
  { key: 'other', label: 'Other', icon: 'dots-horizontal' },
]

const RATINGS = [1, 2, 3, 4, 5]

export default function FeedbackScreen() {
  const { colors } = useAppTheme()
  const [category, setCategory] = useState('general')
  const [rating, setRating] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter your feedback message.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await submitFeedback({
        category,
        message: message.trim(),
        rating,
      })
      setMessage('')
      setRating(null)
      setCategory('general')
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Could not submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ScrollView
        style={[styles.root, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.title, { color: colors.text }]}>Share your feedback</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tell us about bugs, ideas, or anything we can improve in the app.
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((item) => {
              const active = category === item.key
              return (
                <Pressable
                  key={item.key}
                  style={[
                    styles.categoryChip,
                    {
                      borderColor: active ? colors.primary : colors.borderStrong,
                      backgroundColor: active ? colors.primarySoft : colors.chipBg,
                    },
                  ]}
                  onPress={() => setCategory(item.key)}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={18}
                    color={active ? colors.primary : colors.iconMuted}
                  />
                  <Text style={[styles.categoryText, { color: active ? colors.primary : colors.text }]}>
                    {item.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Rating (optional)</Text>
          <View style={styles.ratingRow}>
            {RATINGS.map((value) => {
              const active = rating === value
              return (
                <Pressable
                  key={value}
                  style={[
                    styles.ratingChip,
                    {
                      borderColor: active ? colors.primary : colors.borderStrong,
                      backgroundColor: active ? colors.primarySoft : colors.chipBg,
                    },
                  ]}
                  onPress={() => setRating(active ? null : value)}
                >
                  <Text style={[styles.ratingText, { color: active ? colors.primary : colors.textSecondary }]}>
                    {value}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your feedback..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            style={[
              styles.messageInput,
              {
                color: colors.text,
                borderColor: colors.borderStrong,
                backgroundColor: colors.inputBg,
              },
            ]}
          />

          <FormError message={error} />
          <FormSubmitButton label="Submit Feedback" loading={loading} onPress={handleSubmit} />
        </View>
      </ScrollView>

      <Snackbar visible={success} onDismiss={() => setSuccess(false)} duration={2500}>
        Thank you for your feedback!
      </Snackbar>
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: 20,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  categoryChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categoryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  ratingChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  messageInput: {
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: 16,
  },
})
