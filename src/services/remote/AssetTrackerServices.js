import { apiGet, apiPost } from './Config/ApiGeneric'

export function getAssetTracker(BlegId) {
  const endpoint = `/api/AssetTracker/GetAssetTracker?BlegId=${BlegId}`
  return apiGet(endpoint)
}

export function getVariablesSensorTypes(BlegId) {
  const endpoint = `/api/AssetTracker/GetVariableSensorTypes?BlegId=${BlegId}`
  return apiGet(endpoint)
}

export function AddAssetTracker(body) {
  const endpoint = `/api/AssetTracker/AddAssetTracker`
  return apiPost(endpoint, body)
}
