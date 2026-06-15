import { ref, computed } from 'vue'
import api from '../services/api'

const token = ref<string | null>(localStorage.getItem('token'))
const user = ref<any>(null)

function parseJwt(tokenValue: string) {
  try {
    const base = tokenValue.split('.')[1]
    const json = atob(base.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

if (token.value) {
  try {
    user.value = parseJwt(token.value)
    api.defaults.headers.common.Authorization = `Bearer ${token.value}`
  } catch {
    user.value = null
  }
}

window.addEventListener('storage', (ev) => {
  if (ev.key === 'token') {
    const t = ev.newValue
    if (t) {
      user.value = parseJwt(t)
      api.defaults.headers.common.Authorization = `Bearer ${t}`
    } else {
      user.value = null
      delete api.defaults.headers.common.Authorization
    }
  }
})

export function useAuth() {
  function saveToken(t: string) {
    token.value = t
    localStorage.setItem('token', t)
    user.value = parseJwt(t)
    api.defaults.headers.common.Authorization = `Bearer ${t}`
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    delete api.defaults.headers.common.Authorization
  }

  async function register(email: string, password: string) {
    const res = await api.post('/auth/register', { email, password })
    return res.data
  }

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    if (res.data?.access_token) {
      saveToken(res.data.access_token)
      if (res.data?.refresh_token) localStorage.setItem('refresh_token', res.data.refresh_token)
    }
    return res.data
  }

  function getUserId(): number | null {
    if (!user.value) return null
    return user.value.sub || user.value.userId || null
  }

  const isAuthenticated = computed(() => !!user.value)

  return { token, user, isAuthenticated, register, login, logout, getUserId }
}
