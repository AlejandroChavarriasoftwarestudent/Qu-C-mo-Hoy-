import { getUser, handleAuthCallback, onAuthChange } from '@netlify/identity'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import NuevaContrasena from './pages/NuevaContrasena'
import Inicio from './pages/Inicio'
import PerfilClinico from './pages/perfilClinico'
import Confi from './pages/Confi'
import Registrarse from './pages/registrarse'

import Presupuesto from './pages/Presupuesto'
import Favoritos from './pages/Favoritos'

import Descubrir from './pages/Descubrir'
import Asistente from './pages/Asistente'


async function loadSession() {
  try {
    const callback = await handleAuthCallback()
    if (callback) return { user: callback.user, callback }
    return { user: await getUser() }
  } catch {
    return { user: await getUser(), error: 'No se pudo abrir el enlace. Es posible que ya se haya usado o que haya caducado.' }
  }
}

function RequireSession({ user }) {
  const { pathname, search, hash } = useLocation()
  return user ? <Outlet /> : <Navigate to="/" replace state={{ from: { pathname, search, hash } }} />
}

function LoginRoute({ session }) {
  const { state } = useLocation()
  return session.user
    ? <Navigate to={state?.from ?? '/descubrir'} replace />
    : <Inicio callbackError={session.error} />
}

function App() {
  const [session, setSession] = useState(null)
  const initialSession = useRef(null)

  useEffect(() => {
    let active = true
    initialSession.current ??= loadSession()
    initialSession.current.then((result) => {
      if (active) setSession(result)
    })
    const unsubscribe = onAuthChange((event, user) => {
      setSession((current) => {
        if (!current) return current
        if (event === 'logout' || event === 'login') return { user }
        return { ...current, user }
      })
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  if (!session) return <p className="container py-5" role="status">Comprobando sesión…</p>

  if (session.callback?.type === 'recovery' || session.callback?.type === 'invite') {
    return <NuevaContrasena callback={session.callback} onComplete={(user) => setSession({ user })} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoute session={session} />} />
        <Route path="/registrarse" element={session.user ? <Navigate to="/descubrir" replace /> : <Registrarse />} />
        <Route element={<RequireSession user={session.user} />}>
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
