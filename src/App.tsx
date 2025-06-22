import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import OrdersList from './pages/Orders/OrdersList'
import OrderDetail from './pages/Orders/OrderDetail'
import CreateOrder from './pages/Orders/CreateOrder'
import UsersList from './pages/Users/UsersList'
import CreateUser from './pages/Users/CreateUser'
import ProductsList from './pages/Products/ProductsList'
import CreateProduct from './pages/Products/CreateProduct'
import ReportsList from './pages/Reports/ReportsList'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Check if user is already logged in
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
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/orders/new" element={<CreateOrder />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/reports" element={<ReportsList />} />
      </Routes>
    </Layout>
  )
}

export default App