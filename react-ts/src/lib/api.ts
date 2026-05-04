import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 interceptor — auto-logout on expired/invalid token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const wasLoggedIn = !!localStorage.getItem('authToken')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      if (wasLoggedIn && !window.location.pathname.startsWith('/sign')) {
        window.location.href = '/signin?expired=1'
      }
    }
    return Promise.reject(error)
  }
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
    const response = await apiClient.post('/api/v1/vendors/signup', data)
    if (response.data?.message?.token) {
      localStorage.setItem('authToken', response.data.message.token)
      localStorage.setItem('user', JSON.stringify(response.data.message.vendor))
      localStorage.setItem('userRole', 'vendor')
    }
    return response.data
  },

  vendorLogin: async (data: { username?: string; phone_number?: string; password: string }) => {
    const response = await apiClient.post('/api/v1/vendors/signin', data)
    if (response.data?.message?.token) {
      localStorage.setItem('authToken', response.data.message.token)
      localStorage.setItem('user', JSON.stringify(response.data.message.vendor))
      localStorage.setItem('userRole', 'vendor')
    }
    return response.data
  },

  // Couple Auth
  coupleRegister: async (data: {
    username: string
    phone_number: string
    password: string
    email?: string
  }) => {
    const response = await apiClient.post('/api/v1/couples/signup', data)
    if (response.data?.message?.token) {
      localStorage.setItem('authToken', response.data.message.token)
      localStorage.setItem('user', JSON.stringify(response.data.message.couple))
      localStorage.setItem('userRole', 'couple')
    }
    return response.data
  },

  coupleLogin: async (data: { username?: string; phone_number?: string; password: string }) => {
    const response = await apiClient.post('/api/v1/couples/signin', data)
    if (response.data?.message?.token) {
      localStorage.setItem('authToken', response.data.message.token)
      localStorage.setItem('user', JSON.stringify(response.data.message.couple))
      localStorage.setItem('userRole', 'couple')
    }
    return response.data
  },

  // Unified sign-in — auto-detects couple vs vendor
  unifiedLogin: async (data: { password: string; email?: string; phone?: string }) => {
    const response = await apiClient.post('/api/v1/auth/signin', data)
    if (response.data?.message?.token) {
      localStorage.setItem('authToken', response.data.message.token)
      localStorage.setItem('user', JSON.stringify(response.data.message.user))
      localStorage.setItem('userRole', response.data.message.role)
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
  },
}

export default apiClient

