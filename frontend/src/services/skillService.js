import request from './api'

export function getAllSkills(token) {
  return request('/skills', { token })
}

export function getMySkills(token) {
  return request('/users/me/skills', { token })
}

export function addMySkill(token, payload) {
  return request('/users/me/skills', { method: 'POST', body: payload, token })
}

export function updateMySkill(token, userSkillId, payload) {
  return request(`/users/me/skills/${userSkillId}`, { method: 'PUT', body: payload, token })
}

export function removeMySkill(token, userSkillId) {
  return request(`/users/me/skills/${userSkillId}`, { method: 'DELETE', token })
}
