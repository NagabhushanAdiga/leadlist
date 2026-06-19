import { getStatusColor } from '../constants/leadStatuses'
import {
  fetchMyLeads,
  importMyLeadsFromExcel,
  updateMyLead,
} from './leadService.js'

function withStatusColor(lead) {
  return {
    ...lead,
    statusColor: getStatusColor(lead.status),
    followUpDate: lead.followUpDate || null,
    rejectionReason: lead.rejectionReason || null,
  }
}

export async function getLeads() {
  const leads = await fetchMyLeads()
  return leads.map(withStatusColor)
}

export async function importLeadsFromExcel(file) {
  const result = await importMyLeadsFromExcel(file.uri, file.name)

  return {
    count: result.count,
    leads: result.leads.map(withStatusColor),
  }
}

export async function updateLeadStatus(leadId, status, followUpDate = null, rejectionReason = null) {
  await updateMyLead(leadId, {
    status,
    followUpDate: followUpDate || null,
    rejectionReason: rejectionReason || null,
  })
}
