import axios from 'axios'

// Create different axios instances for each microservice
export const clienteTecnicoApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const osApi = axios.create({
  baseURL: import.meta.env.VITE_OS_API_URL || 'http://localhost:5003',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const produtosApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:5002',
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
const addAuthInterceptor = (apiInstance: typeof axios) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
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