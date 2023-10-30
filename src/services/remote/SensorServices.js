import {apiGet, apiPost, apiDelete, apiUpdate} from './Config/ApiGeneric';

export function getSensorById(sensorId) {
  const enpoint = `/api/sensor/${sensorId}`;
  return apiGet(enpoint);
}

export function getSensorConfig(typeSensorId) {
  const enpoint = `/api/sensortype/${typeSensorId}/config`;
  return apiGet(enpoint);
}

export function getSensorType() {
  const enpoint = '/api/sensorType';
  return apiGet(enpoint);
}

export function validateSensor(SerialNumber) {
  const enpoint = '/api/sensor/validate';
  const body = {SerialNumber};
  return apiPost(enpoint, body);
}

export function createSensor(body) {
  const enpoint = `/api/sensor`;
  return apiPost(enpoint, body);
}

export function editSensor(body) {
  const enpoint = `/api/sensor/update`;
  return apiUpdate(enpoint, body);
}

export function deleteSensor(sensorId) {
  const enpoint = `/api/sensor/gateway/${sensorId}`;
  return apiDelete(enpoint);
}
