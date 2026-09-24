import request from './api'

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export function register(payload) {
  return request('/auth/register', { method: 'POST', body: payload })
}
