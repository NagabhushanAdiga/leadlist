import { Link } from 'expo-router'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { authFormStyles } from '../../styles/authForm'

export function AuthFormFooter({ prompt, linkLabel, href }) {
  return (
    <View style={authFormStyles.footer}>
      <Text variant="bodyMedium" style={authFormStyles.footerText}>
        {prompt}{' '}
      </Text>
      <Link href={href} asChild>
        <Text variant="bodyMedium" style={authFormStyles.link}>
          {linkLabel}
        </Text>
      </Link>
    </View>
  )
}
