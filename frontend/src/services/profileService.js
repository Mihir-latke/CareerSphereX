import request from './api'

export function getMyProfile(token) {
  return request('/users/me/profile', { token })
}

export function updateMyProfile(token, payload) {
  return request('/users/me/profile', { method: 'PUT', body: payload, token })
}
