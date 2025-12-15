import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

export function setAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function refreshAccessToken() {
  // expected backend endpoint that uses HttpOnly refresh cookie
  return api.post('/auth/refresh')
}

export default api
