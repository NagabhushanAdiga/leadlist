import { request } from './httpClient.js'

export function getStats() {
  return request('/stats')
}
