import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { osService } from '../../services/osService'
import { clienteService } from '../../services/clienteService'
import { tecnicoService } from '../../services/tecnicoService'
import { produtoServicoService } from '../../services/produtoServicoService'
import type { OS, Cliente, Tecnico, ProdutoServico } from '../../types'

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OS | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [produtoServico, setProdutoServico] = useState<ProdutoServico | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Validação extra para evitar requisição com id inválido
    if (id && !isNaN(Number(id))) {
      loadOrderDetails(Number(id))
    } else {
      setError('ID da ordem de serviço inválido')
      setLoading(false)
    }
  }, [id])

  const loadOrderDetails = async (orderId: number) => {
    try {
      setLoading(true)
      const orderData = await osService.getById(orderId)
      setOrder(orderData)

      // Load related data
      const [clienteData, tecnicoData, produtoData] = await Promise.all([
        clienteService.getById(orderData.cliente),
        tecnicoService.getById(orderData.tecnico),
        produtoServicoService.getById(orderData.produtoServico)
      ])

      setCliente(clienteData)
      setTecnico(tecnicoData)
      setProdutoServico(produtoData)
    } catch (err) {
      setError('Erro ao carregar detalhes da ordem de serviço')
      console.error('Error loading order details:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string): 'warning' | 'info' | 'success' | 'error' | 'default' => {
    switch (status.toLowerCase()) {
      case 'aberta':
        return 'warning'
      case 'em andamento':
        return 'info'
      case 'fechada':
        return 'success'
      case 'cancelada':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !order) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Alert severity="error">
          {error || 'Ordem de serviço não encontrada'}
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/orders')}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1">
            OS #{order.id}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
          />
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/orders/${order.id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações da OS
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Data de Abertura
                </Typography>
                <Typography variant="body1">
                  {formatDate(order.dataAbertura)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status) as any}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Descrição do Problema
                </Typography>
                <Typography variant="body1">
                  {order.descricaoProblema}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cliente
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {cliente && (
                <>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Nome
                    </Typography>
                    <Typography variant="body1">
                      {cliente.nome}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      CPF/CNPJ
                    </Typography>
                    <Typography variant="body1">
                      {cliente.cpfCnpj}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {cliente.email}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Telefone
                    </Typography>
                    <Typography variant="body1">
                      {cliente.telefone}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Endereço
                    </Typography>
                    <Typography variant="body1">
                      {cliente.endereco}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Técnico Responsável
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {tecnico && (
                <>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Nome
                    </Typography>
                    <Typography variant="body1">
                      {tecnico.nome}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Cargo
                    </Typography>
                    <Typography variant="body1">
                      {tecnico.cargo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {tecnico.email}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Produto/Serviço
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {produtoServico && (
                <>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Código
                    </Typography>
                    <Typography variant="body1">
                      {produtoServico.codigo}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Nome
                    </Typography>
                    <Typography variant="body1">
                      {produtoServico.nome}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Descrição
                    </Typography>
                    <Typography variant="body1">
                      {produtoServico.descricao}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Valor
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(produtoServico.valor)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tempo Estimado
                    </Typography>
                    <Typography variant="body1">
                      {produtoServico.tempoEstimado} minutos
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OrderDetail