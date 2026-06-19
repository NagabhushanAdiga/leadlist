import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { getLeads } from '../services/leadStorage'
import { buildHomeStats } from '../utils/homeStats'
import { useScreenLoading } from './useScreenLoading'

export function useHomeScreen() {
  const initialLoading = useScreenLoading()
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(true)

  const loadLeads = useCallback(async () => {
    const data = await getLeads()
    setLeads(data)
    setLoadingLeads(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadLeads()
    }, [loadLeads]),
  )

  const stats = useMemo(() => buildHomeStats(leads), [leads])

  return {
    initialLoading,
    loadingLeads,
    stats,
  }
}
