import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { osService } from '../../services/osService'
import type { OS } from '../../types'
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

export default function EditOrder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OS | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      osService.getById(Number(id))
        .then(setOrder)
        .catch(() => setError('Erro ao carregar OS'))
        .finally(() => setLoading(false))
    } else {
      setError('ID inválido')
      setLoading(false)
    }
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (!order || !e.target.name) return
    setOrder({ ...order, [e.target.name]: e.target.value as string })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (order && id) {
      await osService.update(Number(id), order)
      setSuccess('Ordem de serviço atualizada!')
      setTimeout(() => navigate(`/orders/${id}`), 1200)
    }
  }

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    )

  if (error) return <Alert severity="error">{error}</Alert>
  if (!order) return <Alert severity="warning">OS não encontrada</Alert>

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} align="center">
          Editar Ordem de Serviço
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={order.status}
              label="Status"
              onChange={(e) =>
                handleChange({
                  target: { name: 'status', value: e.target.value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <MenuItem value="aberta">Aberta</MenuItem>
              <MenuItem value="em andamento">Em Andamento</MenuItem>
              <MenuItem value="fechada">Fechada</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Descrição do Problema"
            name="descricaoProblema"
            value={order.descricaoProblema}
            onChange={handleChange}
            multiline
            rows={3}
          />
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Salvar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}