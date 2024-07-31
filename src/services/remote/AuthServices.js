import { apiPost } from './Config/ApiGeneric'

export function getAuth(UserName, Password, Database) {
  const enpoint = '/api/authentication/login'
  const body = { UserName, Password, Database }
  return apiPost(enpoint, body)
}
