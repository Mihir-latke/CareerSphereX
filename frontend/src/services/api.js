const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function request(path, { method = 'GET', body, token, isFormData = false } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export default request
