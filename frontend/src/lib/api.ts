import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
}

export const accountApi = {
  getMe: () => api.get('/api/accounts/me'),
  getDashboard: () => api.get('/api/accounts/dashboard'),
  changePassword: (data: any) => api.put('/api/accounts/change-password', data),
  changePin: (data: any) => api.put('/api/accounts/change-pin', data),
}

export const transactionApi = {
  transfer: (data: any) => api.post('/api/transactions/transfer', data),
  getHistory: (page = 0, size = 20) => 
    api.get(`/api/transactions/history?page=${page}&size=${size}`),
  getByRef: (ref: string) => api.get(`/api/transactions/${ref}`),
}

export const externalApi = {
  topUp: (accountNumber: string, data: any) => 
    api.post(`/api/external/topup/${accountNumber}`, data),
}
