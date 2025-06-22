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
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Add as AddIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { clienteService } from '../../services/clienteService'
import { tecnicoService } from '../../services/tecnicoService'
import type { Cliente, Tecnico } from '../../types'

const UsersList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const [clientesData, tecnicosData] = await Promise.all([
        clienteService.getAll(),
        tecnicoService.getAll()
      ])

      setClientes(clientesData)
      setTecnicos(tecnicosData)
    } catch (err) {
      setError('Erro ao carregar usuários')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
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
          Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/users/new')}
        >
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`Clientes (${clientes.length})`} />
          <Tab label={`Técnicos (${tecnicos.length})`} />
        </Tabs>

        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CPF/CNPJ</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Endereço</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Nenhum cliente encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id} hover>
                      <TableCell>{cliente.id}</TableCell>
                      <TableCell>{cliente.nome}</TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.cpfCnpj}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell>
                        {cliente.endereco.length > 50
                          ? `${cliente.endereco.substring(0, 50)}...`
                          : cliente.endereco}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Cargo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tecnicos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Nenhum técnico encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tecnicos.map((tecnico) => (
                    <TableRow key={tecnico.id} hover>
                      <TableCell>{tecnico.id}</TableCell>
                      <TableCell>{tecnico.nome}</TableCell>
                      <TableCell>{tecnico.email}</TableCell>
                      <TableCell>{tecnico.cargo}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}

export default UsersList