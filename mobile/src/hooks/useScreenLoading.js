import { useEffect, useState } from 'react'
export function useScreenLoading(delay = 900) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(timer)
  }, [delay])
  return loading
}
