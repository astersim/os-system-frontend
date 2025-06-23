import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tecnicoService } from '../../services/tecnicoService'
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material'
import type { Tecnico } from '../../types'

export default function EditTecnico() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      tecnicoService.getById(Number(id))
        .then(setTecnico)
        .catch(() => setError('Erro ao carregar dados do técnico'))
        .finally(() => setLoading(false))
    } else {
      setError('ID inválido')
      setLoading(false)
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tecnico) return
    setTecnico({ ...tecnico, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (tecnico && id) {
      try {
        await tecnicoService.update(Number(id), tecnico)
        setSuccess('Técnico atualizado com sucesso!')
        setTimeout(() => navigate('/users'), 1500)
      } catch {
        setError('Erro ao atualizar técnico')
      }
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>
  if (!tecnico) return <Alert severity="warning">Técnico não encontrado</Alert>

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} align="center">Editar Técnico</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            name="nome"
            value={tecnico.nome}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={tecnico.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Cargo"
            name="cargo"
            value={tecnico.cargo}
            onChange={handleChange}
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
