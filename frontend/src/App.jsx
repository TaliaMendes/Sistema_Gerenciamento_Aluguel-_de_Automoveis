import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { AdminLogin } from './pages/AdminLogin';
import { Veiculos } from './pages/Veiculos';
import { MinhasReservas } from './pages/MinhasReservas';
import { Reservar } from './pages/Reservar';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminVeiculoForm } from './pages/AdminVeiculoForm';
import { AdminMultas } from './pages/AdminMultas';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import './App.css'

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/admin" element={<AdminLogin />} />


          <Route path="/veiculos" element={<Veiculos />} />

          <Route
            path="/reservar/:veiculoId"
            element={
              <ProtectedRoute>
                <Reservar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minhas-reservas"
            element={
              <ProtectedRoute>
                <MinhasReservas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/veiculos/novo"
            element={
              <ProtectedRoute requireAdmin>
                <AdminVeiculoForm />
              </ProtectedRoute>
            }
          />

           <Route
            path="/admin/veiculos/editar/:id"
            element={
              <ProtectedRoute requireAdmin>
                <AdminVeiculoForm />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/multas"
            element={
              <ProtectedRoute requireAdmin>
                <AdminMultas />
              </ProtectedRoute>
            }
          />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
