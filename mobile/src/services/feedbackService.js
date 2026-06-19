import { apiRequest } from './httpClient.js'

export function submitFeedback(payload) {
  return apiRequest('/my/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
