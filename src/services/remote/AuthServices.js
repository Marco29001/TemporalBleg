import {apiPost} from './Config/ApiGeneric';

export function getAuth(UserName, Password, Database) {
  const enpoint = '/api/user/Login';
  const body = {UserName, Password, Database};
  return apiPost(enpoint, body);
}
