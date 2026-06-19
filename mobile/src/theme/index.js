import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { fontSize } from './typography'
import { darkAppColors, lightAppColors } from './colors'
function buildFonts(baseFonts) {
  return {
    ...baseFonts,
    bodySmall: { ...baseFonts.bodySmall, fontSize: fontSize.sm, lineHeight: 20 },
    bodyMedium: { ...baseFonts.bodyMedium, fontSize: fontSize.md, lineHeight: 22 },
    bodyLarge: { ...baseFonts.bodyLarge, fontSize: fontSize.body, lineHeight: 24 },
    labelLarge: { ...baseFonts.labelLarge, fontSize: fontSize.md, lineHeight: 22 },
    labelMedium: { ...baseFonts.labelMedium, fontSize: fontSize.sm, lineHeight: 20 },
    labelSmall: { ...baseFonts.labelSmall, fontSize: fontSize.xs, lineHeight: 18 },
    titleSmall: { ...baseFonts.titleSmall, fontSize: fontSize.lg, lineHeight: 24 },
    titleMedium: { ...baseFonts.titleMedium, fontSize: fontSize.xl, lineHeight: 26 },
    titleLarge: { ...baseFonts.titleLarge, fontSize: fontSize.xxl, lineHeight: 30 },
    headlineSmall: { ...baseFonts.headlineSmall, fontSize: fontSize.display, lineHeight: 32 },
    headlineMedium: { ...baseFonts.headlineMedium, fontSize: fontSize.hero, lineHeight: 36 },
  }
}

export function buildPaperTheme(isDark) {
  const base = isDark ? MD3DarkTheme : MD3LightTheme
  const appColors = isDark ? darkAppColors : lightAppColors
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: appColors.primary,
      primaryContainer: isDark ? '#2A2650' : '#E8E6FF',
      secondary: '#FF6584',
      secondaryContainer: isDark ? '#3D1F28' : '#FFE4EA',
      background: appColors.background,
      surface: appColors.surface,
      surfaceVariant: isDark ? '#252936' : '#F0F1F8',
      onPrimary: '#FFFFFF',
      onSurface: appColors.text,
      onSurfaceVariant: appColors.textSecondary,
      outline: isDark ? '#374151' : '#D1D5DB',
      elevation: {
        ...base.colors.elevation,
        level1: appColors.surface,
        level2: appColors.surface,
        level3: appColors.card,
      },
    },
    fonts: buildFonts(base.fonts),
    roundness: 16,
    animation: {
      scale: 0,
    },
  }
}

export const theme = buildPaperTheme(false)
export { fontSize, lineHeight } from './typography'
export { darkAppColors, lightAppColors } from './colors'
export const gradients = {
  auth: ['#0B1B3A', '#1E4FD8', '#2F80ED'],
  accent: ['#FF6584', '#FF8FA3'],
}