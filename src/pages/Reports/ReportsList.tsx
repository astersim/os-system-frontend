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
  TextField,
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
import { generateClientsReport } from '../../components/Reports/ClientsReport'
import { generateTechniciansReport } from '../../components/Reports/TechniciansReport'
import type { OSWithDetails, Cliente, Tecnico, ProdutoServico } from '../../types'

const ReportsList = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<OSWithDetails[]>([])
  const [clients, setClients] = useState<Cliente[]>([])
  const [technicians, setTechnicians] = useState<Tecnico[]>([])
  const [products, setProducts] = useState<ProdutoServico[]>([])

  // Filters
  const [reportType, setReportType] = useState('orders')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

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

      // Enrich orders with client names
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
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredOrders = () => {
    let filtered = [...orders]

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter(order => 
        new Date(order.dataAbertura) >= new Date(dateFrom)
      )
    }

    if (dateTo) {
      filtered = filtered.filter(order => 
        new Date(order.dataAbertura) <= new Date(dateTo)
      )
    }

    return filtered
  }

  const handleGenerateReport = async () => {
    try {
      setLoading(true)
      setError('')

      const dateRange = dateFrom && dateTo 
        ? `${new Date(dateFrom).toLocaleDateString('pt-BR')} a ${new Date(dateTo).toLocaleDateString('pt-BR')}`
        : undefined

      switch (reportType) {
        case 'orders':
          const filteredOrders = getFilteredOrders()
          await generateOrdersReport(
            filteredOrders,
            'Relatório de Ordens de Serviço',
            dateRange
          )
          break
        
        case 'clients':
          await generateClientsReport(clients, 'Relatório de Clientes')
          break
        
        case 'technicians':
          await generateTechniciansReport(technicians, 'Relatório de Técnicos')
          break
        
        default:
          setError('Tipo de relatório não selecionado')
          return
      }

      // Show success message briefly
      setTimeout(() => {
        setError('')
      }, 3000)
      
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
    } finally {
      setLoading(false)
    }
  }

  const getUniqueStatuses = () => {
    const statuses = [...new Set(orders.map(order => order.status))]
    return statuses
  }

  const getReportStats = () => {
    const filteredOrders = getFilteredOrders()
    
    return {
      totalOrders: filteredOrders.length,
      totalClients: clients.length,
      totalTechnicians: technicians.length,
      totalProducts: products.length,
      statusBreakdown: filteredOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }

  const stats = getReportStats()

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AssessmentIcon fontSize="large" />
        <Typography variant="h4" component="h1">
          Relatórios
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Filters Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configurações do Relatório
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" flexDirection="column" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Relatório</InputLabel>
                  <Select
                    value={reportType}
                    label="Tipo de Relatório"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="orders">Ordens de Serviço</MenuItem>
                    <MenuItem value="clients">Clientes</MenuItem>
                    <MenuItem value="technicians">Técnicos</MenuItem>
                  </Select>
                </FormControl>

                {reportType === 'orders' && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel>Filtrar por Status</InputLabel>
                      <Select
                        value={statusFilter}
                        label="Filtrar por Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="">Todos os Status</MenuItem>
                        {getUniqueStatuses().map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Data Inicial"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Data Final"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </>
                )}

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

        {/* Statistics Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas do Sistema
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={1}>
                    <Typography variant="h4" color="white">
                      {stats.totalOrders}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Ordens de Serviço
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
                    <Typography variant="h4" color="white">
                      {stats.totalClients}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Clientes
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
                    <Typography variant="h4" color="white">
                      {stats.totalTechnicians}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Técnicos
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={1}>
                    <Typography variant="h4" color="white">
                      {stats.totalProducts}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Produtos/Serviços
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {reportType === 'orders' && Object.keys(stats.statusBreakdown).length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Distribuição por Status
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                      <Grid item xs={6} md={4} key={status}>
                        <Box p={1} bgcolor="grey.100" borderRadius={1} textAlign="center">
                          <Typography variant="body2" color="text.secondary">
                            {status}
                          </Typography>
                          <Typography variant="h6">
                            {count}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReportsList