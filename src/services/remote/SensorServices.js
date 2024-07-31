import { apiGet, apiPost, apiDelete, apiUpdate } from './Config/ApiGeneric'

export function getSensorById(SensorId) {
  const endpoint = `/api/Sensor/GetSensorById?SensorId=${SensorId}`
  return apiGet(endpoint)
}

export function getVariableSensorMaping(SensorTypeId, BlegId) {
  let module = 'Add'
  const endpoint = `/api/Sensor/GetVariablesSensorMaping?SensorTypeId=${SensorTypeId}&SensorId=${0}&BlegId=${BlegId}&Module=${module}`
  return apiGet(endpoint)
}

export function getSensorByQrCode(QrCode, BlegId) {
  const endpoint = `/api/Sensor/GetSensorByQrCode?QrCode=${QrCode}&BlegId=${BlegId}`
  return apiGet(endpoint)
}

export function getSensorType() {
  const endpoint = '/api/Sensor/GetSensorType'
  return apiGet(endpoint)
}

export function addSensor(body) {
  const endpoint = `/api/Sensor/AddSensor`
  return apiPost(endpoint, body)
}

export function updateSensor(body) {
  const endpoint = `/api/Sensor/UpdateSensor`
  return apiUpdate(endpoint, body)
}

export function deleteSensor(SensorId) {
  const endpoint = `/api/Sensor/DeleteSensor?SensorId=${SensorId}`
  return apiDelete(endpoint)
}
