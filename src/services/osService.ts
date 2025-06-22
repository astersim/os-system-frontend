import { osApi } from './api'
import type { OS } from '../types'

export const osService = {
  getAll: async (): Promise<OS[]> => {
    const response = await osApi.get('/api/os')
    return response.data
  },

  getById: async (id: number): Promise<OS> => {
    const response = await osApi.get(`/api/os/${id}`)
    return response.data
  },

  create: async (os: Omit<OS, 'id'>): Promise<OS> => {
    const response = await osApi.post('/api/os', os)
    return response.data
  },

  update: async (id: number, os: Omit<OS, 'id'>): Promise<OS> => {
    const response = await osApi.put(`/api/os/${id}`, os)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await osApi.delete(`/api/os/${id}`)
  },
}