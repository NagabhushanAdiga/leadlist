import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from 'react-native-paper'
import { useAppTheme } from '../context/ThemeContext'
import { authFormStyles } from '../styles/authForm'

const inputTheme = {
  roundness: 8,
  animation: {
    scale: 0,
  },
}

export function AuthTextField({ label, ...props }) {
  const { colors } = useAppTheme()

  return (
    <View style={authFormStyles.field}>
      <Text style={[authFormStyles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        mode="outlined"
        placeholder={`Enter ${label.toLowerCase()}`}
        style={[authFormStyles.input, { backgroundColor: colors.inputBg }]}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        theme={inputTheme}
        {...props}
      />
    </View>
  )
}
