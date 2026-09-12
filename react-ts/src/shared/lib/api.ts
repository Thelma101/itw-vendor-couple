import axios from 'axios'

/** Prefer env; otherwise same host as the page (so phones on LAN hit your PC API). */
function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:3000`
  }
  return 'http://localhost:3000'
}

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Friends & family demo accounts (no backend required)
export const DEMO_ACCOUNTS = {
  couple: {
    email: 'couple@itheewed.demo',
    phone: '08012345678',
    password: 'Couple123!',
    user: {
      id: 'demo-couple-1',
      username: 'Ada & Tunde',
      email: 'couple@itheewed.demo',
      phone_number: '08012345678',
    },
  },
  vendor: {
    email: 'vendor@itheewed.demo',
    phone: '08098765432',
    password: 'Vendor123!',
    user: {
      id: 'demo-vendor-1',
      username: 'Bloom & Co',
      business_name: 'Bloom & Co Events',
      email: 'vendor@itheewed.demo',
      phone_number: '08098765432',
    },
  },
} as const

function normalizeContact(value?: string) {
  return (value || '').trim().toLowerCase()
}

function normalizePhone(value?: string) {
  return (value || '').replace(/\D/g, '')
}

function matchesDemo(
  role: 'couple' | 'vendor',
  data: { username?: string; phone_number?: string; email?: string; phone?: string; password: string },
) {
  const account = DEMO_ACCOUNTS[role]
  const contact = normalizeContact(data.username || data.email)
  const phone = normalizePhone(data.phone_number || data.phone)
  const passwordOk = data.password === account.password
  const emailOk = contact === account.email
  const phoneOk = phone.length > 0 && phone === normalizePhone(account.phone)
  return passwordOk && (emailOk || phoneOk)
}

function persistSession(role: 'couple' | 'vendor', user: object, token: string) {
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('userRole', role)
}

function demoSession(role: 'couple' | 'vendor') {
  const account = DEMO_ACCOUNTS[role]
  const token = `demo-${role}-token`
  const userKey = role === 'couple' ? 'couple' : 'vendor'
  persistSession(role, account.user, token)
  return {
    message: {
      token,
      role,
      user: account.user,
      [userKey]: account.user,
    },
  }
}

export function isNetworkError(error: unknown) {
  if (!axios.isAxiosError(error)) return false
  return !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED'
}

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  // Only attach real JWTs — demo tokens are not Bearer JWTs and break some proxies
  if (token && !token.startsWith('demo-')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 interceptor — auto-logout on expired/invalid token (skip demo tokens)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('authToken') || ''
      if (token.startsWith('demo-')) {
        return Promise.reject(error)
      }
      const wasLoggedIn = !!localStorage.getItem('authToken')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      if (wasLoggedIn && !window.location.pathname.startsWith('/sign')) {
        window.location.href = '/signin?expired=1'
      }
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authApi = {
  // Vendor Auth
  vendorRegister: async (data: {
    business_name?: string
    username: string
    phone_number: string
    password: string
  }) => {
    try {
      const response = await apiClient.post('/api/v1/vendors/signup', data)
      if (response.data?.message?.token) {
        persistSession('vendor', response.data.message.vendor, response.data.message.token)
      }
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        // Local demo signup when API is offline
        return demoSession('vendor')
      }
      throw error
    }
  },

  vendorLogin: async (data: { username?: string; phone_number?: string; password: string }) => {
    try {
      const response = await apiClient.post('/api/v1/vendors/signin', data)
      if (response.data?.message?.token) {
        persistSession('vendor', response.data.message.vendor, response.data.message.token)
      }
      return response.data
    } catch (error) {
      if (isNetworkError(error) && matchesDemo('vendor', data)) {
        return demoSession('vendor')
      }
      if (isNetworkError(error)) {
        const err = new Error('Demo login: use vendor@itheewed.demo / Vendor123!') as Error & {
          response?: { data: { message: string } }
        }
        err.response = { data: { message: 'Demo login: use vendor@itheewed.demo / Vendor123!' } }
        throw err
      }
      throw error
    }
  },

  // Couple Auth
  coupleRegister: async (data: {
    username: string
    phone_number: string
    password: string
    email?: string
  }) => {
    try {
      const response = await apiClient.post('/api/v1/couples/signup', data)
      if (response.data?.message?.token) {
        persistSession('couple', response.data.message.couple, response.data.message.token)
      }
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        return demoSession('couple')
      }
      throw error
    }
  },

  coupleLogin: async (data: { username?: string; phone_number?: string; password: string }) => {
    try {
      const response = await apiClient.post('/api/v1/couples/signin', data)
      if (response.data?.message?.token) {
        persistSession('couple', response.data.message.couple, response.data.message.token)
      }
      return response.data
    } catch (error) {
      if (isNetworkError(error) && matchesDemo('couple', data)) {
        return demoSession('couple')
      }
      if (isNetworkError(error)) {
        const err = new Error('Demo login: use couple@itheewed.demo / Couple123!') as Error & {
          response?: { data: { message: string } }
        }
        err.response = { data: { message: 'Demo login: use couple@itheewed.demo / Couple123!' } }
        throw err
      }
      throw error
    }
  },

  // Unified sign-in — auto-detects couple vs vendor
  unifiedLogin: async (data: { password: string; email?: string; phone?: string }) => {
    try {
      const response = await apiClient.post('/api/v1/auth/signin', data)
      if (response.data?.message?.token) {
        persistSession(
          response.data.message.role,
          response.data.message.user,
          response.data.message.token,
        )
      }
      return response.data
    } catch (error) {
      if (isNetworkError(error) && matchesDemo('couple', data)) {
        return demoSession('couple')
      }
      if (isNetworkError(error) && matchesDemo('vendor', data)) {
        return demoSession('vendor')
      }
      if (isNetworkError(error)) {
        const err = new Error(
          'Demo login: couple@itheewed.demo / Couple123! or vendor@itheewed.demo / Vendor123!',
        ) as Error & { response?: { data: { message: string } } }
        err.response = {
          data: {
            message:
              'Demo login: couple@itheewed.demo / Couple123! or vendor@itheewed.demo / Vendor123!',
          },
        }
        throw err
      }
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
  },
}

export const searchApi = {
  vendors: async (params: {
    q?: string
    category?: string
    location?: string
    maxPrice?: number
    limit?: number
  }) => {
    const response = await apiClient.get('/api/v1/search/vendors', { params })
    return response.data as {
      engine: 'elasticsearch' | 'memory'
      total: number
      results: Array<{
        id: string
        name: string
        category: string
        location: string
        price: number
        rating: number
        reviewCount: number
        image: string
        verified: boolean
        features: string[]
        description: string
      }>
    }
  },
}

export const paymentsApi = {
  listBoosts: async () =>
    (await apiClient.get('/api/v1/payments/boosts')).data as {
      boosts: Array<{
        id: string
        name: string
        amountNaira: number
        days: number
        unlockCredits: number
        upgradesPlan: boolean
      }>
    },
  initBoost: async (boostId: string, callbackUrl?: string) =>
    (
      await apiClient.post('/api/v1/payments/boost/init', {
        boostId,
        callbackUrl: callbackUrl || `${window.location.origin}/vendor/subscription`,
      })
    ).data as {
      reference: string
      amountNaira: number
      amountKobo: number
      email: string
      publicKey: string
      authorizationUrl: string
      accessCode: string
      boost: {
        id: string
        name: string
        unlockCredits: number
        upgradesPlan: boolean
        days: number
      }
    },
  verify: async (reference: string) =>
    (await apiClient.get(`/api/v1/payments/verify/${encodeURIComponent(reference)}`)).data as {
      status: 'success'
      reference: string
      boostId: string
      amountNaira: number
      unlockCredits: number
      upgradesPlan: boolean
      boostName?: string
      days?: number
    },
}

function coupleHeaders() {
  const headers: Record<string, string> = {}
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}') as { id?: string; email?: string }
    if (user.email === 'couple@itheewed.demo' || user.id === 'demo-couple-1') {
      headers['x-couple-id'] = 'demo-couple'
    } else if (user.id) {
      headers['x-couple-id'] = user.id
    } else {
      headers['x-couple-id'] = 'demo-couple'
    }
  } catch {
    headers['x-couple-id'] = 'demo-couple'
  }
  return { headers }
}

export const planningApi = {
  listGuests: async () => (await apiClient.get('/api/v1/guests', coupleHeaders())).data,
  createGuest: async (body: Record<string, unknown>) =>
    (await apiClient.post('/api/v1/guests', body, coupleHeaders())).data,
  updateGuest: async (id: string, body: Record<string, unknown>) =>
    (await apiClient.patch(`/api/v1/guests/${id}`, body, coupleHeaders())).data,
  deleteGuest: async (id: string) =>
    (await apiClient.delete(`/api/v1/guests/${id}`, coupleHeaders())).data,

  getBudget: async () => (await apiClient.get('/api/v1/budget', coupleHeaders())).data,
  updateBudget: async (body: { totalBudget: number; notes?: string }) =>
    (await apiClient.patch('/api/v1/budget', body, coupleHeaders())).data,
  createExpense: async (body: Record<string, unknown>) =>
    (await apiClient.post('/api/v1/budget/expenses', body, coupleHeaders())).data,
  updateExpense: async (id: string, body: Record<string, unknown>) =>
    (await apiClient.patch(`/api/v1/budget/expenses/${id}`, body, coupleHeaders())).data,
  deleteExpense: async (id: string) =>
    (await apiClient.delete(`/api/v1/budget/expenses/${id}`, coupleHeaders())).data,

  listChecklist: async () => (await apiClient.get('/api/v1/checklist', coupleHeaders())).data,
  createChecklistItem: async (body: Record<string, unknown>) =>
    (await apiClient.post('/api/v1/checklist', body, coupleHeaders())).data,
  updateChecklistItem: async (id: string, body: Record<string, unknown>) =>
    (await apiClient.patch(`/api/v1/checklist/${id}`, body, coupleHeaders())).data,
  deleteChecklistItem: async (id: string) =>
    (await apiClient.delete(`/api/v1/checklist/${id}`, coupleHeaders())).data,

  listConversations: async () => (await apiClient.get('/api/v1/messages', coupleHeaders())).data,
  getConversation: async (id: string) =>
    (await apiClient.get(`/api/v1/messages/conversation/${id}`, coupleHeaders())).data,
  startConversation: async (body: { vendorName: string; text?: string; vendorType?: string; avatar?: string }) =>
    (await apiClient.post('/api/v1/messages/conversations', body, coupleHeaders())).data,
  sendMessage: async (id: string, text: string) =>
    (await apiClient.post(`/api/v1/messages/conversation/${id}/messages`, { text }, coupleHeaders())).data,
}

export default apiClient
