import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import { gradients } from '../../theme'
import { fontSize } from '../../theme/typography'

export function DrawerProfileHeader({ user, paddingTop, onPressProfile }) {
  return (
    <LinearGradient
      colors={gradients.auth}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop }]}
    >
      <Pressable
        style={({ pressed }) => [styles.profile, pressed && styles.pressed]}
        onPress={onPressProfile}
      >
        <Avatar.Text
          size={62}
          label={user?.name?.charAt(0).toUpperCase() || 'U'}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <Text variant="titleMedium" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodySmall" style={styles.email}>
          {user?.email}
        </Text>
        <View style={styles.viewProfileRow}>
          <Text style={styles.viewProfile}>View Profile</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#FFFFFF" />
        </View>
      </Pressable>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profile: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.9,
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarLabel: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  name: {
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  email: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    textAlign: 'center',
  },
  viewProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  viewProfile: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
