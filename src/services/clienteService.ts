import { clienteTecnicoApi } from './api'
import type { Cliente } from '../types'

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await clienteTecnicoApi.get('/api/clientes')
    return response.data
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await clienteTecnicoApi.get(`/api/clientes/${id}`)
    return response.data
  },

  create: async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
    const response = await clienteTecnicoApi.post('/api/clientes', cliente)
    return response.data
  },

  update: async (id: number, cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
    const response = await clienteTecnicoApi.put(`/api/clientes/${id}`, cliente)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await clienteTecnicoApi.delete(`/api/clientes/${id}`)
  },
}