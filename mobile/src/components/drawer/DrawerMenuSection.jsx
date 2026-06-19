import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { fontSize } from '../../theme/typography'
import { DrawerNavItem } from './DrawerNavItem'

export function DrawerMenuSection({ title, items, colors, isActive, onNavigate }) {
  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      <View style={[styles.menuCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
        {items.map((item) => (
          <DrawerNavItem
            key={item.href}
            item={item}
            active={isActive(item)}
            colors={colors}
            onPress={() => onNavigate(item.href)}
          />
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 18,
    paddingVertical: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
})
