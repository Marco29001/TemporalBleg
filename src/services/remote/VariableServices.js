import {apiGet} from './Config/ApiGeneric';

export function getVariables() {
  const enpoint = '/api/variable';
  return apiGet(enpoint);
}
