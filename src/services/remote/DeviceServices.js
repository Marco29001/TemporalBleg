import {apiGet} from './Config/ApiGeneric';

export function getDevices() {
  const enpoint = '/api/device';
  return apiGet(enpoint);
}
