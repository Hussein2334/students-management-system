import axios from 'axios'

// API base URL — inasoma kutoka env
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Ongeza token kwenye kila ombi kama mtumiaji ameingia
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Kama token imeisha muda, jaribu ku-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem('refresh_token')
    ) {
      original._retry = true
      try {
        const res = await axios.post(
          `${API_URL}/auth/token/refresh/`,
          { refresh: localStorage.getItem('refresh_token') }
        )
        localStorage.setItem('access_token', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch (e) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api