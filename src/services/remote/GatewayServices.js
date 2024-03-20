import {apiGet, apiPost} from './Config/ApiGeneric';

export function getGateways() {
  const endpoint = '/v2/api/gateway';
  return apiGet(endpoint);
}

export function getGatewayById(gatewayId) {
  const endpoint = `/api/gateway/${gatewayId}`;
  return apiGet(endpoint);
}

export function validateGateway(SerialNumber, database) {
  const endpoint = '/api/gateway/validate';
  const body = {SerialNumber, database};
  return apiPost(endpoint, body);
}

export function createGateway(body) {
  const endpoint = '/api/gateway';
  return apiPost(endpoint, body);
}

export function synchronizeGateway(gatewayId, deviceId) {
  const endpoint = `/api/gateway/GenerateAndSendSynchronize?gatewayId=${gatewayId}&deviceId=${deviceId}`;
  return apiGet(endpoint);
}

export function CheckVersionSynchronize(
  gatewayId,
  deviceId,
  messageId,
  version,
) {
  const endpoint = `/api/gateway/CheckVersionSynchronize?gatewayId=${gatewayId}&deviceId=${deviceId}&messageId=${messageId}&version=${version}`;
  return apiGet(endpoint);
}
