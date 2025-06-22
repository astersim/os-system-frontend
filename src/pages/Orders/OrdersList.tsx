import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { osService } from '../../services/osService'
import { clienteService } from '../../services/clienteService'
import type { OS, Cliente, OSWithDetails } from '../../types'

const OrdersList = () => {
  const [orders, setOrders] = useState<OSWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const [osData, clientesData] = await Promise.all([
        osService.getAll(),
        clienteService.getAll()
      ])

      // Enrich OS data with client names
      const enrichedOrders: OSWithDetails[] = osData.map((os: OS) => {
        const cliente = clientesData.find((c: Cliente) => c.id === os.cliente)
        return {
          ...os,
          clienteNome: cliente?.nome || 'Cliente não encontrado'
        }
      })

      setOrders(enrichedOrders)
    } catch (err) {
      setError('Erro ao carregar ordens de serviço')
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Ordens de Serviço
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/orders/new')}
        >
          Nova OS
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Abertura</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma ordem de serviço encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.clienteNome}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(order.dataAbertura)}</TableCell>
                  <TableCell>
                    {order.descricaoProblema.length > 50
                      ? `${order.descricaoProblema.substring(0, 50)}...`
                      : order.descricaoProblema}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      title="Ver detalhes"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default OrdersList