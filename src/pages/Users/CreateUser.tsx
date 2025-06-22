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
import { clienteService } from '../../services/clienteService'
import { tecnicoService } from '../../services/tecnicoService'

const CreateUser = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userType, setUserType] = useState('cliente')

  const [clienteData, setClienteData] = useState({
    nome: '',
    cpfCnpj: '',
    endereco: '',
    telefone: '',
    email: '',
  })

  const [tecnicoData, setTecnicoData] = useState({
    nome: '',
    cargo: '',
    email: '',
    senha: '',
  })

  const handleClienteChange = (field: string, value: string) => {
    setClienteData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTecnicoChange = (field: string, value: string) => {
    setTecnicoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateClienteForm = () => {
    return clienteData.nome && clienteData.cpfCnpj && clienteData.endereco && 
           clienteData.telefone && clienteData.email
  }

  const validateTecnicoForm = () => {
    return tecnicoData.nome && tecnicoData.cargo && tecnicoData.email && tecnicoData.senha
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (userType === 'cliente' && !validateClienteForm()) {
      setError('Por favor, preencha todos os campos do cliente')
      return
    }

    if (userType === 'tecnico' && !validateTecnicoForm()) {
      setError('Por favor, preencha todos os campos do técnico')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      if (userType === 'cliente') {
        await clienteService.create(clienteData)
        setSuccess('Cliente criado com sucesso!')
      } else {
        await tecnicoService.create(tecnicoData)
        setSuccess('Técnico criado com sucesso!')
      }
      
      setTimeout(() => {
        navigate('/users')
      }, 2000)
    } catch (err) {
      setError(`Erro ao criar ${userType}`)
      console.error(`Error creating ${userType}:`, err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Novo Usuário
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
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Usuário</InputLabel>
                  <Select
                    value={userType}
                    label="Tipo de Usuário"
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <MenuItem value="cliente">Cliente</MenuItem>
                    <MenuItem value="tecnico">Técnico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {userType === 'cliente' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={clienteData.nome}
                      onChange={(e) => handleClienteChange('nome', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CPF/CNPJ"
                      value={clienteData.cpfCnpj}
                      onChange={(e) => handleClienteChange('cpfCnpj', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={clienteData.email}
                      onChange={(e) => handleClienteChange('email', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={clienteData.telefone}
                      onChange={(e) => handleClienteChange('telefone', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      value={clienteData.endereco}
                      onChange={(e) => handleClienteChange('endereco', e.target.value)}
                      required
                    />
                  </Grid>
                </>
              )}

              {userType === 'tecnico' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={tecnicoData.nome}
                      onChange={(e) => handleTecnicoChange('nome', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      value={tecnicoData.cargo}
                      onChange={(e) => handleTecnicoChange('cargo', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={tecnicoData.email}
                      onChange={(e) => handleTecnicoChange('email', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Senha"
                      type="password"
                      value={tecnicoData.senha}
                      onChange={(e) => handleTecnicoChange('senha', e.target.value)}
                      required
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/users')}
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
                    {loading ? <CircularProgress size={20} /> : `Criar ${userType === 'cliente' ? 'Cliente' : 'Técnico'}`}
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

export default CreateUser