import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useAppTheme } from '../context/ThemeContext'

function ShimmerOverlay({ highlightColor }) {
  const translateX = useSharedValue(-220)

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(420, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    )
  }, [translateX])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <LinearGradient
        colors={['transparent', highlightColor, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shimmerGradient}
      />
    </Animated.View>
  )
}

export function ShimmerBox({ width = '100%', height = 16, borderRadius = 8, style }) {
  const { colors } = useAppTheme()

  return (
    <View
      style={[
        styles.box,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.shimmer,
        },
        style,
      ]}
    >
      <ShimmerOverlay highlightColor={colors.shimmerHighlight} />
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
  },
  shimmerGradient: {
    width: 220,
    height: '100%',
  },
})
