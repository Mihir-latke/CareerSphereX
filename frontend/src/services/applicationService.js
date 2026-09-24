import request from './api'

export function applyForJob(token, jobId, { coverLetter, resume }) {
  const form = new FormData()
  if (coverLetter) form.append('coverLetter', coverLetter)
  if (resume)      form.append('resume', resume)
  return request(`/jobs/${jobId}/apply`, {
    method: 'POST',
    body: form,
    token,
    isFormData: true,
  })
}

export function getMyApplications(token) {
  return request('/applications/my', { token })
}

export function getApplicants(token, jobId) {
  return request(`/jobs/${jobId}/applicants`, { token })
}

export function updateStatus(token, applicationId, status) {
  return request(`/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
}
