import { clienteTecnicoApi } from './api'
import type { Tecnico } from '../types'

export const tecnicoService = {
  getAll: async (): Promise<Tecnico[]> => {
    const response = await clienteTecnicoApi.get('/api/tecnicos')
    return response.data
  },

  getById: async (id: number): Promise<Tecnico> => {
    const response = await clienteTecnicoApi.get(`/api/tecnicos/${id}`)
    return response.data
  },

  create: async (tecnico: Omit<Tecnico, 'id'>): Promise<Tecnico> => {
    const response = await clienteTecnicoApi.post('/api/tecnicos', tecnico)
    return response.data
  },

  update: async (id: number, tecnico: Omit<Tecnico, 'id'>): Promise<Tecnico> => {
    const response = await clienteTecnicoApi.put(`/api/tecnicos/${id}`, tecnico)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await clienteTecnicoApi.delete(`/api/tecnicos/${id}`)
  },
}