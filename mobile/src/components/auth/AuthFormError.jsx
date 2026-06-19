import { HelperText } from 'react-native-paper'
import { authFormStyles } from '../../styles/authForm'

export function AuthFormError({ message }) {
  if (!message) {
    return null
  }

  return (
    <HelperText type="error" visible style={authFormStyles.error}>
      {message}
    </HelperText>
  )
}
