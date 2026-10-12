import axios from 'axios'
import { DEMO_EMAIL, IS_LIVE_APP, SITE_URL } from './session'

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
  // The API host sleeps when idle and can take up to a minute to wake
  timeout: 70000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Fire-and-forget request so the API is awake by the time someone submits a form. */
export function warmUpApi() {
  fetch(`${resolveApiBaseUrl()}/api/v1/health`, { mode: 'cors' }).catch(() => undefined)
}

/** Turns Nest validation arrays, network failures and timeouts into one readable sentence. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Our server is taking longer than usual to respond. Please try again in a moment.'
    }
    if (!error.response) {
      return 'We could not reach iTheeWed. Check your internet connection and try again.'
    }
    const message = (error.response.data as { message?: unknown } | undefined)?.message
    if (Array.isArray(message) && message.length) return String(message[0])
    if (typeof message === 'string' && message.trim()) return message
  }
  const own = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
  if (typeof own === 'string' && own.trim()) return own
  return fallback
}

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
  if (IS_LIVE_APP) return false
  const account = DEMO_ACCOUNTS[role]
  const contact = normalizeContact(data.username || data.email)
  const phone = normalizePhone(data.phone_number || data.phone)
  const passwordOk = data.password === account.password
  const emailOk = contact === account.email
  const phoneOk = phone.length > 0 && phone === normalizePhone(account.phone)
  return passwordOk && (emailOk || phoneOk)
}

function persistSession(role: 'couple' | 'vendor', user: object, token: string) {
  if (IS_LIVE_APP && DEMO_EMAIL.test((user as { email?: string })?.email || '')) {
    const err = new Error('Demo accounts only work on the preview app.') as Error & {
      response?: { data: { message: string } }
    }
    err.response = { data: { message: 'Demo accounts only work on the preview app. Please sign up with your own email.' } }
    throw err
  }
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

const RETURN_TO_KEY = 'itw_return_to'
const LIVE_SITE_ORIGINS = ['https://itheewed.co', 'https://www.itheewed.co']

/** Remember the live site a user signed in from so logout can send them back there. */
export function rememberReturnOrigin(origin: string | null) {
  if (!origin) return
  const clean = origin.replace(/\/$/, '')
  const allowed = LIVE_SITE_ORIGINS.includes(clean) || (import.meta.env.DEV && /^http:\/\/localhost:\d+$/.test(clean))
  if (allowed) localStorage.setItem(RETURN_TO_KEY, clean)
}

function clearSession(): string | null {
  const returnTo = localStorage.getItem(RETURN_TO_KEY) || (IS_LIVE_APP ? SITE_URL : null)
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  localStorage.removeItem('userRole')
  localStorage.removeItem(RETURN_TO_KEY)
  return returnTo
}

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
      const returnTo = clearSession()
      if (wasLoggedIn && returnTo) {
        window.location.replace(`${returnTo}/signin?expired=1&signedout=1`)
      } else if (wasLoggedIn && !window.location.pathname.startsWith('/sign')) {
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
    phone_number?: string
    email?: string
    password: string
  }) => {
    const response = await apiClient.post('/api/v1/vendors/signup', data)
    if (response.data?.message?.token) {
      persistSession('vendor', response.data.message.vendor, response.data.message.token)
    }
    return response.data
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
      if (isNetworkError(error) && !IS_LIVE_APP) {
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
    phone_number?: string
    password: string
    email?: string
  }) => {
    const response = await apiClient.post('/api/v1/couples/signup', data)
    if (response.data?.message?.token) {
      persistSession('couple', response.data.message.couple, response.data.message.token)
    }
    return response.data
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
      if (isNetworkError(error) && !IS_LIVE_APP) {
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
      if (isNetworkError(error) && !IS_LIVE_APP) {
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

  /** Returns true when the user is being sent back to the live site, so callers skip in-app navigation. */
  logout: (): boolean => {
    const returnTo = clearSession()
    if (returnTo) {
      window.location.replace(`${returnTo}/?signedout=1`)
      return true
    }
    return false
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
  initPlan: async (planId: string, callbackUrl?: string) =>
    (
      await apiClient.post('/api/v1/payments/plan/init', {
        planId,
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
      plan: {
        id: string
        name: string
        amountNaira: number
        seats: number
      }
    },
  verify: async (reference: string) =>
    (await apiClient.get(`/api/v1/payments/verify/${encodeURIComponent(reference)}`)).data as {
      status: 'success'
      reference: string
      boostId: string
      planId?: string
      amountNaira: number
      unlockCredits: number
      upgradesPlan: boolean
      boostName?: string
      planName?: string
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

/* ── Live workspace APIs (real accounts) ── */

export type PublicUser = {
  id: string
  username: string
  email: string
  phone_number?: string
  role: 'couple' | 'vendor'
  plan?: string
  business_name?: string
}
export type Profile = Record<string, unknown>
export type MeResponse = { user: PublicUser; profile: Profile }

export function apiBaseUrl() {
  return resolveApiBaseUrl()
}

export const meApi = {
  get: async () => (await apiClient.get('/api/v1/me')).data as MeResponse,
  update: async (body: { username?: string; phone_number?: string; business_name?: string; profile?: Profile }) =>
    (await apiClient.patch('/api/v1/me', body)).data as MeResponse,
  remove: async () => (await apiClient.delete('/api/v1/me')).data as { ok: boolean },
  getDoc: async <T>(key: string) =>
    (await apiClient.get(`/api/v1/me/docs/${key}`)).data as { key: string; value: T | null; updatedAt: string | null },
  putDoc: async <T>(key: string, value: T) =>
    (await apiClient.put(`/api/v1/me/docs/${key}`, { value })).data as { key: string; value: T; updatedAt: string },
}

export const uploadsApi = {
  /** Stores a data-URL image on the server and returns a URL any device can load. */
  upload: async (dataUrl: string) => {
    const { path } = (await apiClient.post('/api/v1/uploads', { dataUrl })).data as { id: string; path: string }
    return `${resolveApiBaseUrl()}${path}`
  },
}

export type DirectoryVendor = {
  id: string
  name: string
  category: string
  location: string
  city: string
  price: number
  rating: number
  reviewCount: number
  image: string
  avatar: string
  verified: boolean
  features: string[]
  description: string
}
export type DirectoryVendorDetail = {
  card: DirectoryVendor
  profile: {
    tagline: string
    bio: string
    phone: string
    whatsapp: string
    instagram: string
    website: string
    yearsInBusiness: number
    responseTime: string
    avatar: string
    cover: string
  }
  services: Array<{ id: string; name: string; price: number; description: string; active: boolean; type: 'Package' | 'Add-on'; features: string[]; popular?: boolean }>
  portfolio: Array<{ id: string; title: string; cover: string; type?: string; gallery?: string[]; items?: number; published?: boolean }>
}

export const directoryApi = {
  list: async (params: { q?: string; category?: string; location?: string; maxPrice?: number; limit?: number } = {}) =>
    (await apiClient.get('/api/v1/directory/vendors', { params })).data as { engine: 'directory'; total: number; results: DirectoryVendor[] },
  get: async (id: string) => (await apiClient.get(`/api/v1/directory/vendors/${encodeURIComponent(id)}`)).data as DirectoryVendorDetail,
}

export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'declined' | 'cancelled'
export type Inquiry = {
  id: string
  kind: 'inquiry' | 'booking'
  status: InquiryStatus
  source: 'couple' | 'vendor'
  coupleId: string
  coupleName: string
  coupleEmail: string
  couplePhone: string
  vendorId: string
  vendorName: string
  vendorCategory: string
  eventDate: string
  guestCount: number
  budget: number
  amount: number
  location: string
  packageName: string
  message: string
  notes: string
  createdAt: string
  updatedAt: string
}
type InquiryInput = Partial<Pick<Inquiry, 'kind' | 'eventDate' | 'guestCount' | 'budget' | 'amount' | 'location' | 'packageName' | 'message'>>

export const inquiriesApi = {
  list: async (kind?: 'inquiry' | 'booking') =>
    (await apiClient.get('/api/v1/inquiries', { params: kind ? { kind } : {} })).data as Inquiry[],
  /** Couple → vendor. Also opens a message thread and notifies the vendor. */
  create: async (body: InquiryInput & { vendorId: string }) => (await apiClient.post('/api/v1/inquiries', body)).data as Inquiry,
  /** Vendor records an offline client. */
  createManual: async (
    body: InquiryInput & { coupleName: string; coupleEmail?: string; couplePhone?: string; notes?: string; status?: InquiryStatus },
  ) => (await apiClient.post('/api/v1/inquiries/manual', body)).data as Inquiry,
  update: async (id: string, body: Partial<Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'coupleId' | 'vendorId'>>) =>
    (await apiClient.patch(`/api/v1/inquiries/${id}`, body)).data as Inquiry,
  remove: async (id: string) => (await apiClient.delete(`/api/v1/inquiries/${id}`)).data as { ok: boolean },
}

export type ThreadMessage = { id: string; sender: 'couple' | 'vendor'; text: string; createdAt: string }
export type ThreadSummary = {
  id: string
  coupleId: string
  coupleName: string
  vendorId: string
  vendorName: string
  vendorCategory: string
  vendorImage: string
  lastMessage: string
  unread: number
  messageCount: number
  createdAt: string
  updatedAt: string
}
export type Thread = Omit<ThreadSummary, 'unread' | 'messageCount'> & {
  messages: ThreadMessage[]
  unreadCouple: number
  unreadVendor: number
}

export const threadsApi = {
  list: async () => (await apiClient.get('/api/v1/threads')).data as ThreadSummary[],
  get: async (id: string) => (await apiClient.get(`/api/v1/threads/${id}`)).data as Thread,
  /** Couples pass vendorId; vendors pass coupleId (only for couples who contacted them). */
  start: async (body: { vendorId?: string; coupleId?: string; text?: string }) => (await apiClient.post('/api/v1/threads', body)).data as Thread,
  send: async (id: string, text: string) => (await apiClient.post(`/api/v1/threads/${id}/messages`, { text })).data as Thread,
}

export type ServerNotification = {
  id: string
  type: 'inquiry' | 'booking' | 'message' | 'payment' | 'system'
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
}

export const notificationsApi = {
  list: async () => (await apiClient.get('/api/v1/notifications')).data as ServerNotification[],
  markRead: async (id: string) => (await apiClient.patch(`/api/v1/notifications/${id}/read`)).data,
  markAllRead: async () => (await apiClient.post('/api/v1/notifications/read-all')).data,
  remove: async (id: string) => (await apiClient.delete(`/api/v1/notifications/${id}`)).data,
}

export type WeddingSite = { id: string; coupleId: string; slug: string; published: boolean; data: Record<string, unknown>; updatedAt: string }

export const websiteApi = {
  mine: async () => ((await apiClient.get('/api/v1/website/me')).data || null) as WeddingSite | null,
  save: async (body: { data?: Record<string, unknown>; published?: boolean; slug?: string }) =>
    (await apiClient.put('/api/v1/website/me', body)).data as WeddingSite,
  public: async (slug: string) =>
    (await apiClient.get(`/api/v1/website/public/${encodeURIComponent(slug)}`)).data as { slug: string; data: Record<string, unknown>; updatedAt: string },
}

export const passwordApi = {
  forgot: async (email: string) =>
    (await apiClient.post('/api/v1/auth/forgot-password', { email })).data as { ok: boolean; emailEnabled: boolean },
  reset: async (email: string, code: string, password: string) =>
    (await apiClient.post('/api/v1/auth/reset-password', { email, code, password })).data as { ok: boolean },
}

export default apiClient
