import Api from './ApiConfig'

export function apiGet(endpoint) {
  const controller = new AbortController()
  return {
    call: Api.get(endpoint, {
      signal: controller.signal,
    }),
    controller,
  }
}

export function apiPost(endpoint, body = '') {
  const controller = new AbortController()
  return {
    call: Api.post(endpoint, body, {
      signal: controller.signal,
    }),
    controller,
  }
}

export function apiUpdate(endpoint, body = '') {
  const controller = new AbortController()
  return {
    call: Api.put(endpoint, body, {
      signal: controller.signal,
    }),
    controller,
  }
}

export function apiDelete(endpoint) {
  const controller = new AbortController()
  return {
    call: Api.delete(endpoint, {
      signal: controller.signal,
    }),
    controller,
  }
}
