import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
} from '@mui/material'
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { produtoServicoService } from '../../services/produtoServicoService'
import type { ProdutoServico } from '../../types'

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProdutoServico>({
    id: 0,
    codigo: '',
    nome: '',
    descricao: '',
    valor: 0,
    tempoEstimado: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id))
    }
  }, [id])

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true)
      const data = await produtoServicoService.getById(productId)
      setProduct(data)
    } catch (err) {
      setError('Erro ao carregar produto/serviço')
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ProdutoServico) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setProduct(prev => ({
      ...prev,
      [field]: field === 'valor' || field === 'tempoEstimado' 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    
    // Se for um número direto, usa como minutos
    if (/^\d+$/.test(value)) {
      setProduct(prev => ({
        ...prev,
        tempoEstimado: parseInt(value) || 0
      }))
      return
    }

    // Tenta fazer parse de formato "Xh Ymin"
    const match = value.match(/(\d+)h?\s*(\d+)?m?/)
    if (match) {
      const hours = parseInt(match[1] || '0')
      const minutes = parseInt(match[2] || '0')
      setProduct(prev => ({
        ...prev,
        tempoEstimado: hours * 60 + minutes
      }))
    }
  }

  const formatTimeForInput = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const validateForm = (): boolean => {
    if (!product.codigo.trim()) {
      setError('Código é obrigatório')
      return false
    }
    if (!product.nome.trim()) {
      setError('Nome é obrigatório')
      return false
    }
    if (!product.descricao.trim()) {
      setError('Descrição é obrigatória')
      return false
    }
    if (product.valor <= 0) {
      setError('Valor deve ser maior que zero')
      return false
    }
    if (product.tempoEstimado <= 0) {
      setError('Tempo estimado deve ser maior que zero')
      return false
    }
    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError('')
      
      await produtoServicoService.update(product.id, product)
      
      setSuccess('Produto/serviço atualizado com sucesso!')
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/products')
      }, 2000)
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto/serviço'
      setError(errorMessage)
      console.error('Error updating product:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    navigate('/products')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Editar Produto/Serviço - {product.nome}
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

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                value={product.codigo}
                onChange={handleChange('codigo')}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                value={product.nome}
                onChange={handleChange('nome')}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={product.descricao}
                onChange={handleChange('descricao')}
                multiline
                rows={4}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={product.valor}
                onChange={handleChange('valor')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  step: 0.01,
                }}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tempo Estimado"
                value={formatTimeForInput(product.tempoEstimado)}
                onChange={handleTimeChange}
                helperText="Digite em minutos (ex: 120) ou formato hora (ex: 2h 30min)"
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default ProductEdit