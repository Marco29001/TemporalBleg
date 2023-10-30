import Api from './ApiConfig';

export function apiGet(enpoint) {
  const controller = new AbortController();
  return {
    call: Api.get(enpoint, {
      signal: controller.signal,
    }),
    controller,
  };
}

export function apiPost(enpoint, body = '') {
  const controller = new AbortController();
  return {
    call: Api.post(enpoint, body, {
      signal: controller.signal,
    }),
    controller,
  };
}

export function apiUpdate(enpoint, body = '') {
  const controller = new AbortController();
  return {
    call: Api.put(enpoint, body, {
      signal: controller.signal,
    }),
    controller,
  };
}

export function apiDelete(enpoint) {
  const controller = new AbortController();
  return {
    call: Api.delete(enpoint, {
      signal: controller.signal,
    }),
    controller,
  };
}
