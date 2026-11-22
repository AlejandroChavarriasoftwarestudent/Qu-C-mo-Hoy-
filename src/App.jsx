import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Inicio from './pages/Inicio'
import PerfilClinico from './pages/perfilClinico'
import Confi from './pages/Confi'
import Registrarse from './pages/registrarse'
import Presupuesto from './pages/Presupuesto'
import Favoritos from './pages/Favoritos'
import Descubrir from './pages/Descubrir'
import Asistente from './pages/Asistente'
import { obtenerUsuario } from './services/api'

function RequireSession({ user }) {
  const { pathname, search, hash } = useLocation()
  return user ? <Outlet /> : <Navigate to="/" replace state={{ from: { pathname, search, hash } }} />
}

function LoginRoute({ user }) {
  const { state } = useLocation()
  return user ? <Navigate to={state?.from ?? '/descubrir'} replace /> : <Inicio />
}

function App() {
  const [user, setUser] = useState(obtenerUsuario)

  useEffect(() => {
    const actualizar = () => setUser(obtenerUsuario())
    window.addEventListener('sesion', actualizar)
    return () => window.removeEventListener('sesion', actualizar)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoute user={user} />} />
        <Route path="/registrarse" element={user ? <Navigate to="/descubrir" replace /> : <Registrarse />} />
        <Route element={<RequireSession user={user} />}>
          <Route path="/perfil-clinico" element={<PerfilClinico />} />
          <Route path="/configuracion" element={<Confi />} />
          <Route path="/Confi.jsx" element={<Confi />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/descubrir" element={<Descubrir />} />
          <Route path="/asistente" element={<Asistente />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
