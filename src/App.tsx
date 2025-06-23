import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout/Layout'

// Pages e Components
import OrdersList from './pages/Orders/OrdersList'
import CreateOrder from './pages/Orders/CreateOrder'
import OrderDetail from './pages/Orders/OrderDetail'
import EditOrder from './pages/Orders/EditOrder'

import ProductsList from './pages/Products/ProductsList'
import CreateProduct from './pages/Products/CreateProduct'
import EditProdutoServico from './pages/Products/EditProdutoServico'

import UsersList from './pages/Users/UsersList'
import CreateUser from './pages/Users/CreateUser'

import ReportsList from './pages/Reports/ReportsList'
//import ClientsReport from './components/Reports/ClientsReport'
import OrdersReport from './components/Reports/OrdersReport'
//import TechniciansReport from './components/Reports/TechniciansReport'

import Login from './pages/Login/Login'


import EditCliente from './pages/Users/EditCliente'
import EditTecnico from './pages/Users/EditTecnico'

function DynamicEditCliente() {
  const { id } = useParams()
  return <EditCliente id={Number(id)} />
}

function DynamicEditTecnico() {
  const { id } = useParams()
  return <EditTecnico id={Number(id)} />
}

function DynamicEditProdutoServico() {
  const { id } = useParams()
  return <EditProdutoServico id={Number(id)} />
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('authToken', 'fake-jwt-token')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />

        {/* ORDERS */}
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/orders/new" element={<CreateOrder />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/orders/:id/edit" element={<EditOrder />} />

        {/* USERS */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/clients/:id/edit" element={<DynamicEditCliente />} />
        <Route path="/technicians/:id/edit" element={<DynamicEditTecnico />} />

        {/* PRODUCTS */}
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/products/:id/edit" element={<DynamicEditProdutoServico />} />

        {/* REPORTS */}
        <Route path="/reports" element={<ReportsList />} />
        <Route path="/reports/orders" element={<OrdersReport orders={[]} title="Relatório de Ordens de Serviço" />} />

      </Routes>
    </Layout>
  )
}

export default App