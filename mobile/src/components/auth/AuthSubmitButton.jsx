import { Button } from 'react-native-paper'
import { authFormStyles } from '../../styles/authForm'

export function AuthSubmitButton({ label, loading, onPress }) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={loading}
      style={authFormStyles.button}
      contentStyle={authFormStyles.buttonContent}
      theme={{ roundness: 8 }}
    >
      {label}
    </Button>
  )
}
