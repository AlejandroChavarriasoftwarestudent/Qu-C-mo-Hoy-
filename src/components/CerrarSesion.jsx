import { cerrarSesion } from '../services/api'

export default function CerrarSesion({ className = '', children = 'Cerrar sesión' }) {
  return (
    <button className={`${className} w-100 border-0 text-start`} type="button" onClick={cerrarSesion}>
      <i className="bi bi-box-arrow-right" aria-hidden="true" /> {children}
    </button>
  )
}
