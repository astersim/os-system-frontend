import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { produtoServicoService } from '../../services/produtoServicoService'

const CreateProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    valor: '',
    tempoEstimado: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    return formData.codigo && formData.nome && formData.descricao && 
           formData.valor && formData.tempoEstimado
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const productData = {
        codigo: formData.codigo,
        nome: formData.nome,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        tempoEstimado: parseInt(formData.tempoEstimado),
      }

      await produtoServicoService.create(productData)
      setSuccess('Produto/Serviço criado com sucesso!')
      
      setTimeout(() => {
        navigate('/products')
      }, 2000)
    } catch (err) {
      setError('Erro ao criar produto/serviço')
      console.error('Error creating product:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Novo Produto/Serviço
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
                <TextField
                  fullWidth
                  label="Código"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor (R$)"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.valor}
                  onChange={(e) => handleChange('valor', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tempo Estimado (minutos)"
                  type="number"
                  inputProps={{ min: '1' }}
                  value={formData.tempoEstimado}
                  onChange={(e) => handleChange('tempoEstimado', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/products')}
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
                    {loading ? <CircularProgress size={20} /> : 'Criar Produto/Serviço'}
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

export default CreateProduct