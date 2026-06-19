import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from 'react-native-paper'
import { authFormStyles } from '../styles/authForm'

const inputTheme = {
  roundness: 8,
  animation: {
    scale: 0,
  },
}

export function AuthTextField({ label, ...props }) {
  return (
    <View style={authFormStyles.field}>
      <Text style={authFormStyles.label}>{label}</Text>
      <TextInput
        mode="outlined"
        placeholder={`Enter ${label.toLowerCase()}`}
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        theme={inputTheme}
        {...props}
      />
    </View>
  )
}
