import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { produtoServicoService } from '../../services/produtoServicoService'
import type { ProdutoServico } from '../../types'

const EditProdutoServico = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [produto, setProduto] = useState<ProdutoServico | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await produtoServicoService.getById(Number(id))
        setProduto(data)
      } catch (err) {
        setError('Erro ao carregar o produto/serviço')
      } finally {
        setLoading(false)
      }
    }
    fetchProduto()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!produto) return
    const { name, value } = e.target
    setProduto({ ...produto, [name]: name === 'valor' || name === 'tempoEstimado' ? Number(value) : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!produto) return
    try {
      setError('')
      await produtoServicoService.update(produto.id, produto)
      setSuccess('Produto/serviço atualizado com sucesso!')
      setTimeout(() => navigate('/produtos-servicos'), 1500)
    } catch {
      setError('Erro ao atualizar produto/serviço')
    }
  }

  if (loading) return <CircularProgress />
  if (!produto) return <Alert severity="error">Produto/serviço não encontrado</Alert>

  return (
    <Box>
      <Typography variant="h4" mb={3}>Editar Produto/Serviço</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Código"
                  name="codigo"
                  value={produto.codigo}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome"
                  name="nome"
                  value={produto.nome}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  name="descricao"
                  value={produto.descricao}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Valor"
                  name="valor"
                  type="number"
                  value={produto.valor}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Tempo Estimado (min)"
                  name="tempoEstimado"
                  type="number"
                  value={produto.tempoEstimado}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Salvar Alterações
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EditProdutoServico
