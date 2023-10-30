import {apiGet, apiPost} from './Config/ApiGeneric';

export function getGateways() {
  const enpoint = '/v2/api/gateway';
  return apiGet(enpoint);
}

export function getGatewayById(gatewayId) {
  const enpoint = `/api/gateway/${gatewayId}`;
  return apiGet(enpoint);
}

export function validateGateway(SerialNumber, database) {
  const enpoint = '/api/gateway/validate';
  const body = {SerialNumber, database};
  return apiPost(enpoint, body);
}

//pendiente
export function createGateway(body) {
  const enpoint = '/api/gateway';
  return apiPost(enpoint, body);
}
