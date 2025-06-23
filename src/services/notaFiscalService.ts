import { billingApi } from './api'
import type { NotaFiscal } from '../types'

export const notaFiscalService = {
  getAll: async (): Promise<NotaFiscal[]> => {
    const response = await billingApi.get('/api/notas-fiscais')
    return response.data
  },

  getById: async (id: number): Promise<NotaFiscal> => {
    const response = await billingApi.get(`/api/notas-fiscais/${id}`)
    return response.data
  },

  create: async (nota: Omit<NotaFiscal, 'id'>): Promise<NotaFiscal> => {
    const response = await billingApi.post('/api/notas-fiscais', nota)
    return response.data
  },

  update: async (id: number, nota: Omit<NotaFiscal, 'id'>): Promise<NotaFiscal> => {
    const response = await billingApi.put(`/api/notas-fiscais/${id}`, nota)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await billingApi.delete(`/api/notas-fiscais/${id}`)
  },
}
