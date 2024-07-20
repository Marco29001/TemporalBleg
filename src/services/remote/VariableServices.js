import { apiGet } from './Config/ApiGeneric'

export function getVariables() {
  const endpoint = '/api/Variable/GetVariables'
  return apiGet(endpoint)
}
