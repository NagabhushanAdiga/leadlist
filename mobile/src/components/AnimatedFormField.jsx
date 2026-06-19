import { MotiView } from 'moti'
export function AnimatedFormField({ index, children }) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -16 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: 'spring',
        damping: 20,
        delay: 250 + index * 80,
      }}
    >
      {children}
    </MotiView>
  )
}
