import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../src/context/ThemeContext';
import { fontSize } from '../../src/theme/typography';

const THEME_OPTIONS = [
  {
    id: 'light',
    label: 'Light mode',
    description: 'Bright and clean interface',
    icon: 'white-balance-sunny',
  },
  {
    id: 'dark',
    label: 'Dark mode',
    description: 'Easier on the eyes in low light',
    icon: 'moon-waning-crescent',
  },
];

export default function SettingsScreen() {
  const { isDark, setLightMode, setDarkMode, colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Choose how the app looks on your device
        </Text>

        <View style={styles.options}>
          {THEME_OPTIONS.map((option) => {
            const selected = option.id === 'dark' ? isDark : !isDark;

            return (
              <Pressable
                key={option.id}
                style={[
                  styles.option,
                  {
                    backgroundColor: selected ? colors.primarySoft : colors.surfaceMuted,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => (option.id === 'dark' ? setDarkMode() : setLightMode())}
              >
                <View
                  style={[
                    styles.optionIcon,
                    {
                      backgroundColor: selected ? colors.surface : colors.navIconBg,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={24}
                    color={selected ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
                {selected ? (
                  <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Your theme preference is saved automatically and applies across the app.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: 18,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
  },
  optionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
