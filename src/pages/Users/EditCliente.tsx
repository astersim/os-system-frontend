import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types'

const EditCliente = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      clienteService.getById(Number(id))
        .then(setCliente)
        .catch(() => setError('Erro ao carregar cliente'))
        .finally(() => setLoading(false))
    } else {
      setError('ID inválido')
      setLoading(false)
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!cliente) return
    setCliente({ ...cliente, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cliente && id) {
      await clienteService.update(Number(id), cliente)
      setSuccess('Cliente atualizado com sucesso!')
      setTimeout(() => navigate('/users'), 1200)
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" minHeight="300px"><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>
  if (!cliente) return <Alert severity="warning">Cliente não encontrado</Alert>

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" mb={3} align="center">Editar Cliente</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            name="nome"
            value={cliente.nome}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="CPF/CNPJ"
            name="cpfCnpj"
            value={cliente.cpfCnpj}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Telefone"
            name="telefone"
            value={cliente.telefone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Endereço"
            name="endereco"
            value={cliente.endereco}
            onChange={handleChange}
            multiline
            rows={2}
          />
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Salvar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default EditCliente
