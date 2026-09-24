import request from './api'

export function listJobs(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()
  return request(`/jobs${qs ? '?' + qs : ''}`)
}

export function getJob(id, token) {
  return request(`/jobs/${id}`, { token })
}

export function createJob(token, payload) {
  return request('/jobs', { method: 'POST', body: payload, token })
}

export function updateJob(token, id, payload) {
  return request(`/jobs/${id}`, { method: 'PUT', body: payload, token })
}

export function deleteJob(token, id) {
  return request(`/jobs/${id}`, { method: 'DELETE', token })
}

export function getMyJobs(token) {
  return request('/jobs/my', { token })
}

export function toggleSave(token, jobId) {
  return request(`/jobs/${jobId}/save`, { method: 'POST', token })
}

export function getSavedJobs(token) {
  return request('/jobs/saved', { token })
}

export function isSaved(token, jobId) {
  return request(`/jobs/${jobId}/saved`, { token })
}
