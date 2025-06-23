import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import {
  PictureAsPdf as PdfIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material'
import { osService } from '../../services/osService'
import { clienteService } from '../../services/clienteService'
import { tecnicoService } from '../../services/tecnicoService'
import { produtoServicoService } from '../../services/produtoServicoService'
import { generateOrdersReport } from '../../components/Reports/OrdersReport'
import type { OSWithDetails, Cliente, Tecnico, ProdutoServico } from '../../types'

const ReportsList = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<OSWithDetails[]>([])
  const [clients, setClients] = useState<Cliente[]>([])
  const [technicians, setTechnicians] = useState<Tecnico[]>([])
  const [products, setProducts] = useState<ProdutoServico[]>([])
  const [statusFilter, setStatusFilter] = useState('Todos')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ordersData, clientsData, techniciansData, productsData] = await Promise.all([
        osService.getAll(),
        clienteService.getAll(),
        tecnicoService.getAll(),
        produtoServicoService.getAll()
      ])

      const enrichedOrders: OSWithDetails[] = ordersData.map((order) => {
        const client = clientsData.find((c) => c.id === order.cliente)
        const technician = techniciansData.find((t) => t.id === order.tecnico)
        const product = productsData.find((p) => p.id === order.produtoServico)

        return {
          ...order,
          clienteNome: client?.nome || 'Cliente não encontrado',
          tecnicoNome: technician?.nome || 'Técnico não encontrado',
          produtoServicoNome: product?.nome || 'Produto/Serviço não encontrado'
        }
      })

      setOrders(enrichedOrders)
      setClients(clientsData)
      setTechnicians(techniciansData)
      setProducts(productsData)
    } catch (err) {
      setError('Erro ao carregar dados para relatórios')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredOrders = () => {
    if (!statusFilter || statusFilter === 'Todos') {
      return orders
    }
    return orders.filter(o => o.status === statusFilter)
  }

  const handleGenerateReport = async () => {
    try {
      setLoading(true)
      setError('')
      await generateOrdersReport(getFilteredOrders(), 'Relatório de Ordens de Serviço')
    } catch (err) {
      setError('Erro ao gerar relatório')
    } finally {
      setLoading(false)
    }
  }

  const getUniqueStatuses = () => {
    const defaultStatuses = ['aberta', 'em_andamento', 'concluida', 'cancelada']
    const dynamicStatuses = [...new Set(orders.map(o => o.status))]
    const combinedStatuses = Array.from(new Set([...defaultStatuses, ...dynamicStatuses]))
    return combinedStatuses
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AssessmentIcon fontSize="large" />
        <Typography variant="h4">Relatórios</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Configurações do Relatório</Typography>
              <Divider sx={{ my: 2 }} />

              <Box display="flex" flexDirection="column" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    {getUniqueStatuses().map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={handleGenerateReport}
                  disabled={loading}
                  size="large"
                >
                  {loading ? <CircularProgress size={20} /> : 'Gerar Relatório PDF'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Estatísticas do Sistema</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="primary.main" color="white" borderRadius={1}>
                    <Typography variant="h4">{orders.length}</Typography>
                    <Typography>Ordens de Serviço</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="success.main" color="white" borderRadius={1}>
                    <Typography variant="h4">{clients.length}</Typography>
                    <Typography>Clientes</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="warning.main" color="white" borderRadius={1}>
                    <Typography variant="h4">{technicians.length}</Typography>
                    <Typography>Técnicos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="info.main" color="white" borderRadius={1}>
                    <Typography variant="h4">{products.length}</Typography>
                    <Typography>Produtos/Serviços</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReportsList
