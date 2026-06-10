import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Meals from './pages/Meals'
import Reports from './pages/Reports'
import Weight from './pages/Weight'
import Water from './pages/Water'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AppLayout />}>
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/weight" element={<Weight />} />
            <Route path="/water" element={<Water />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
