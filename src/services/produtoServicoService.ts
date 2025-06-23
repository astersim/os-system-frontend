import { produtosApi } from './api'
import type { ProdutoServico } from '../types'

export const produtoServicoService = {
  getAll: async (): Promise<ProdutoServico[]> => {
    const response = await produtosApi.get('/api/produtos-servicos')
    return response.data
  },

  getById: async (id: number): Promise<ProdutoServico> => {
    const response = await produtosApi.get(`/api/produtos-servicos/${id}`)
    return response.data
  },

  create: async (produto: Omit<ProdutoServico, 'id'>): Promise<ProdutoServico> => {
    const response = await produtosApi.post('/api/produtos-servicos', produto)
    return response.data
  },

  update: async (id: number, produto: Omit<ProdutoServico, 'id'>): Promise<ProdutoServico> => {
    const response = await produtosApi.put(`/api/produtos-servicos/${id}`, produto)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await produtosApi.delete(`/api/produtos-servicos/${id}`)
  },
}