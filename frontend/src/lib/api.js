import { useAuth } from '../context/AuthContext'

// In dev, Vite proxy serves /api to backend; in prod, set VITE_API_BASE to your backend URL
const API_BASE = (import.meta.env?.VITE_API_BASE || '').replace(/\/$/, '')

export async function api(path, { method = 'GET', body, token } = {}) {
  const url = `${API_BASE}/api${path}`.replace(/([^:]\/)\/+/g, '$1')
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export function useAuthedApi() {
  const { token } = useAuth()
  return (path, opts = {}) => api(path, { ...opts, token })
}
