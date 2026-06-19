import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'

export function DrawerNavItem({ item, active, onPress, colors }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.navItem,
        active && { backgroundColor: colors.navActiveBg },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: active ? colors.surface : colors.navIconBg }]}>
        <MaterialCommunityIcons
          name={item.icon}
          size={22}
          color={active ? colors.primary : colors.iconMuted}
        />
      </View>
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary },
          active && { color: colors.primary, fontWeight: '700' },
        ]}
      >
        {item.label}
      </Text>
      {active ? (
        <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 3,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
})
