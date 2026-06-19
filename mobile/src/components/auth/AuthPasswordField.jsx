import { TextInput } from 'react-native-paper'
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility'
import { AuthTextField } from '../AuthTextField'

export function AuthPasswordField({
  label,
  value,
  onChangeText,
  showToggle = true,
  icon = 'lock-outline',
  ...props
}) {
  const { visible, toggle } = usePasswordVisibility()

  return (
    <AuthTextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      autoCapitalize="none"
      left={<TextInput.Icon icon={icon} />}
      right={
        showToggle ? (
          <TextInput.Icon
            icon={visible ? 'eye-off-outline' : 'eye-outline'}
            onPress={toggle}
          />
        ) : undefined
      }
      {...props}
    />
  )
}
