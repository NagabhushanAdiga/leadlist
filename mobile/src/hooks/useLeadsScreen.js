import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { getStatusSaveLabel, requiresReminders } from '../constants/leadStatuses'
import {
  cancelFollowUpReminders,
  scheduleFollowUpReminders,
} from '../services/followUpNotifications'
import { getLeads, updateLeadStatus } from '../services/leadStorage'
import { useScreenLoading } from './useScreenLoading'

export function useLeadsScreen() {
  const initialLoading = useScreenLoading()
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [selectedLead, setSelectedLead] = useState(null)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredLeads = useMemo(() => {
    if (activeFilter === 'All') {
      return leads
    }

    return leads.filter((lead) => lead.status === activeFilter)
  }, [activeFilter, leads])

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

  const openStatusModal = (lead) => {
    setSelectedLead(lead)
  }

  const closeStatusModal = () => {
    if (!saving) {
      setSelectedLead(null)
    }
  }

  const handleSaveStatus = async ({ status, followUpDate, rejectionReason }) => {
    if (!selectedLead) {
      return
    }

    setSaving(true)

    try {
      await updateLeadStatus(selectedLead.id, status, followUpDate, rejectionReason)

      if (requiresReminders(status) && followUpDate) {
        const count = await scheduleFollowUpReminders(
          selectedLead.id,
          selectedLead.name,
          followUpDate,
          status,
        )

        const label = getStatusSaveLabel(status)
        setSnackbar(
          count > 0
            ? `${label} saved. ${count} reminder${count > 1 ? 's' : ''} scheduled.`
            : `${label} saved. Reminders could not be scheduled for past dates.`,
        )
      } else {
        await cancelFollowUpReminders(selectedLead.id)
        setSnackbar('Lead status updated successfully.')
      }

      setSelectedLead(null)
      await loadLeads()
    } catch (error) {
      setSnackbar(error.message || 'Could not update lead status.')
    } finally {
      setSaving(false)
    }
  }

  return {
    initialLoading,
    loadingLeads,
    leads,
    filteredLeads,
    activeFilter,
    setActiveFilter,
    selectedLead,
    saving,
    snackbar,
    setSnackbar,
    openStatusModal,
    closeStatusModal,
    handleSaveStatus,
  }
}
