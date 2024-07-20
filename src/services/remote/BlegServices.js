import { apiGet, apiPost, apiUpdate } from './Config/ApiGeneric'

export function getBlegs() {
  const endpoint = '/api/Bleg/GetBlegs'
  return apiGet(endpoint)
}

export function getBlegById(blegId) {
  const endpoint = `/api/Bleg/GetBlegById?BlegId=${blegId}`
  return apiGet(endpoint)
}

export function getBlegBySerialNumber(serialNumber, Mac, database) {
  const endpoint = `/api/Bleg/GetBlegBySerialNumber?SerialNumber=${serialNumber}&Mac=${Mac}&Database=${database}`
  return apiGet(endpoint)
}

export function getBlegByQrCode(codeQr, database) {
  const endpoint = `/api/Bleg/GetBlegByQrCode?CodeQr=${codeQr}&Database=${database}`
  return apiGet(endpoint)
}

export function addBleg(body) {
  const endpoint = '/api/Bleg/AddBleg'
  return apiPost(endpoint, body)
}

export function updateBleg(body) {
  const endpoint = '/api/Bleg/UpdateBleg'
  return apiUpdate(endpoint, body)
}

export function synchronizeBleg(DeviceId, BlegId) {
  const endpoint = `/api/Synchronize/GenerateAndSendSynchronize?DeviceId=${DeviceId}&BlegId=${BlegId}`
  return apiGet(endpoint)
}

export function checkVersionSynchronize(DeviceId, BlegId, MessageId, Version) {
  const endpoint = `/api/Synchronize/CheckVersionSynchronize?DeviceId=${DeviceId}&BlegId=${BlegId}&MessageId=${MessageId}&Version=${Version}`
  return apiGet(endpoint)
}
