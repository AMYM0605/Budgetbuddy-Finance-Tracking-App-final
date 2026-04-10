// import axios from 'axios'

// const API_BASE = import.meta.env.VITE_API_URL || '/api'

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// })

// // ── Request interceptor: attach JWT ──────────────────
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('bb_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // ── Response interceptor: handle 401 ────────────────
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('bb_token')
//       localStorage.removeItem('bb_user')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// // ── Auth ─────────────────────────────────────────────
// export const authAPI = {
//   register: (data) => api.post('/auth/register', data),
//   login:    (data) => api.post('/auth/login', data),
// }

// // ── Transactions ─────────────────────────────────────
// export const transactionAPI = {
//   getAll:   (params) => api.get('/transactions', { params }),
//   getPaged: (page = 0, size = 10) => api.get('/transactions', { params: { page, size } }),
//   create:   (data)   => api.post('/transactions', data),
//   update:   (id, data) => api.put(`/transactions/${id}`, data),
//   delete:   (id)     => api.delete(`/transactions/${id}`),
// }

// // ── Dashboard ─────────────────────────────────────────
// export const dashboardAPI = {
//   get: () => api.get('/dashboard'),
// }

// export default api

//////////////////////////
import axios from 'axios'

// ✅ FIX 1: Proper base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach JWT ──────────────────
// api.interceptors.request.use(
//   (config) => {
//     // ✅ FIX 2: consistent token key
//     const token = localStorage.getItem('token')

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bb_token')

    console.log("TOKEN BEING SENT:", token) // 👈 ADD THIS

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 ────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('bb_user') // optional
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ─────────────────────────────────────────────
export const authAPI = {
  // ✅ FIX 3: correct backend paths
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── Transactions ─────────────────────────────────────
export const transactionAPI = {
  getAll:   (params) => api.get('/transactions', { params }),
  getPaged: (page = 0, size = 10) =>
    api.get('/transactions', { params: { page, size } }),

  // ✅ FIX 4: ensure correct payload structure (handled outside)
  create:   (data)   => api.post('/transactions', data),

  update:   (id, data) => api.put(`/transactions/${id}`, data),

  delete:   (id)     => api.delete(`/transactions/${id}`),
}

// ── Dashboard ─────────────────────────────────────────
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}

export default api