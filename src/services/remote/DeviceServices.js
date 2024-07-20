import { apiGet } from './Config/ApiGeneric'

export function getDevices() {
  const endpoint = '/api/Device/GetDevices'
  return apiGet(endpoint)
}
