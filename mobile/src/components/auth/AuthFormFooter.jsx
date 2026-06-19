import { Link } from 'expo-router'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { useAppTheme } from '../../context/ThemeContext'
import { authFormStyles } from '../../styles/authForm'

export function AuthFormFooter({ prompt, linkLabel, href }) {
  const { colors } = useAppTheme()

  return (
    <View style={authFormStyles.footer}>
      <Text variant="bodyMedium" style={[authFormStyles.footerText, { color: colors.textSecondary }]}>
        {prompt}{' '}
      </Text>
      <Link href={href} asChild>
        <Text variant="bodyMedium" style={[authFormStyles.link, { color: colors.primary }]}>
          {linkLabel}
        </Text>
      </Link>
    </View>
  )
}
