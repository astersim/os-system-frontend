import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { osService } from '../../services/osService'
import { clienteService } from '../../services/clienteService'
import { tecnicoService } from '../../services/tecnicoService'
import { produtoServicoService } from '../../services/produtoServicoService'
import type { Cliente, Tecnico, ProdutoServico } from '../../types'

const CreateOrder = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [produtos, setProdutos] = useState<ProdutoServico[]>([])

  const [formData, setFormData] = useState({
    cliente: '',
    produtoServico: '',
    tecnico: '',
    dataAbertura: new Date().toISOString().split('T')[0],
    status: 'aberta',
    descricaoProblema: '',
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      const [clientesData, tecnicosData, produtosData] = await Promise.all([
        clienteService.getAll(),
        tecnicoService.getAll(),
        produtoServicoService.getAll()
      ])

      setClientes(clientesData)
      setTecnicos(tecnicosData)
      setProdutos(produtosData)
    } catch (err) {
      setError('Erro ao carregar dados iniciais')
      console.error('Error loading initial data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cliente || !formData.produtoServico || !formData.tecnico || !formData.descricaoProblema) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const orderData = {
        cliente: parseInt(formData.cliente),
        produtoServico: parseInt(formData.produtoServico),
        tecnico: parseInt(formData.tecnico),
        dataAbertura: formData.dataAbertura,
        status: 'aberta',
        descricaoProblema: formData.descricaoProblema,
      }

      await osService.create(orderData)
      setSuccess('Ordem de serviço criada com sucesso!')
      
      setTimeout(() => {
        navigate('/orders')
      }, 2000)
    } catch (err) {
      setError('Erro ao criar ordem de serviço')
      console.error('Error creating order:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Nova Ordem de Serviço
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={formData.cliente}
                    label="Cliente"
                    onChange={(e) => handleChange('cliente', e.target.value)}
                  >
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Produto/Serviço</InputLabel>
                  <Select
                    value={formData.produtoServico}
                    label="Produto/Serviço"
                    onChange={(e) => handleChange('produtoServico', e.target.value)}
                  >
                    {produtos.map((produto) => (
                      <MenuItem key={produto.id} value={produto.id.toString()}>
                        {produto.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Técnico</InputLabel>
                  <Select
                    value={formData.tecnico}
                    label="Técnico"
                    onChange={(e) => handleChange('tecnico', e.target.value)}
                  >
                    {tecnicos.map((tecnico) => (
                      <MenuItem key={tecnico.id} value={tecnico.id.toString()}>
                        {tecnico.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Abertura"
                  type="date"
                  value={formData.dataAbertura}
                  onChange={(e) => handleChange('dataAbertura', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição do Problema"
                  multiline
                  rows={4}
                  value={formData.descricaoProblema}
                  onChange={(e) => handleChange('descricaoProblema', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/orders')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Criar OS'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CreateOrder