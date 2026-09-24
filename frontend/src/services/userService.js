import request from './api'

export function switchRole(token, role) {
  return request('/users/me/role', { method: 'PATCH', body: { role }, token })
}
