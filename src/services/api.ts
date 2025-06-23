import axios from 'axios'
import type { AxiosInstance } from 'axios'

// Create different axios instances for each microservice
export const clienteTecnicoApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5007',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const osApi = axios.create({
  baseURL: import.meta.env.VITE_OS_API_URL || 'http://localhost:5005',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const produtosApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:5006',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const billingApi = axios.create({
  baseURL: import.meta.env.VITE_BILLING_API_URL || 'http://localhost:5004',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptors to include auth token if needed
const addAuthInterceptor = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

addAuthInterceptor(clienteTecnicoApi)
addAuthInterceptor(osApi)
addAuthInterceptor(produtosApi)
addAuthInterceptor(billingApi)