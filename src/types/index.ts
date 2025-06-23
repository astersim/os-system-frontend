export interface Cliente {
  id: number
  nome: string
  cpfCnpj: string
  endereco: string
  telefone: string
  email: string
}

export interface Tecnico {
  id: number
  nome: string
  cargo: string
  email: string
  senha: string
}

export interface ProdutoServico {
  id: number
  codigo: string
  nome: string
  descricao: string
  valor: number
  tempoEstimado: number
}

export interface OS {
  id: number
  cliente: number
  produtoServico: number
  tecnico: number
  dataAbertura: string
  status: string
  descricaoProblema: string
}

export interface NotaFiscal {
  id: number
  dataEmissao: string
  ordemDeServico: number
  valorTotal: number
}

export interface OSWithDetails extends OS {
  clienteNome?: string
  tecnicoNome?: string
  produtoServicoNome?: string
}

export interface NotaFiscal {
  id: number
  dataEmissao: string
  ordemDeServico: number
  valorTotal: number
}
