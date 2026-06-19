import { FlatList, StyleSheet, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import { LeadCard, LeadsEmptyState, StatusFilterBar } from '../../src/components/leads'
import { LeadsScreenSkeleton } from '../../src/components/ScreenSkeletons'
import { UpdateLeadStatusModal } from '../../src/components/UpdateLeadStatusModal'
import { useAppTheme } from '../../src/context/ThemeContext'
import { useLeadsScreen } from '../../src/hooks/useLeadsScreen'

export default function LeadsScreen() {
  const { colors } = useAppTheme()
  const {
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
  } = useLeadsScreen()

  if (initialLoading || loadingLeads) {
    return <LeadsScreenSkeleton />
  }

  return (
    <>
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <StatusFilterBar
          activeFilter={activeFilter}
          onSelect={setActiveFilter}
          leads={leads}
        />

        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            filteredLeads.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<LeadsEmptyState activeFilter={activeFilter} />}
          renderItem={({ item }) => (
            <LeadCard
              lead={item}
              onUpdateStatus={openStatusModal}
              onCallFeedback={setSnackbar}
            />
          )}
        />
      </View>

      <UpdateLeadStatusModal
        visible={Boolean(selectedLead)}
        lead={selectedLead}
        onDismiss={closeStatusModal}
        onSave={handleSaveStatus}
        saving={saving}
      />

      <Snackbar
        visible={Boolean(snackbar)}
        onDismiss={() => setSnackbar('')}
        duration={3500}
      >
        {snackbar}
      </Snackbar>
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    padding: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
})
