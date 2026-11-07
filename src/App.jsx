import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inicio from './pages/Inicio'
import PerfilClinico from './pages/perfilClinico'
import Confi from './pages/Confi'
import Registrarse from './pages/registrarse'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil-clinico" element={<PerfilClinico />} />
        <Route path="/configuracion" element={<Confi />} />
        <Route path="/Confi.jsx" element={<Confi />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="*" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
