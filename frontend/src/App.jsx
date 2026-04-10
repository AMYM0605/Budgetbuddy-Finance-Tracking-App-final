import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import TransactionForm from './pages/TransactionForm'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/transactions"      element={<Transactions />} />
        <Route path="/transactions/new"  element={<TransactionForm />} />
        <Route path="/transactions/:id/edit" element={<TransactionForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#181c24',
              color: '#eef0f6',
              border: '1px solid #252a38',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#3ecf8e', secondary: '#181c24' } },
            error:   { iconTheme: { primary: '#f06060', secondary: '#181c24' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
