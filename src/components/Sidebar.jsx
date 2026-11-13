import { Link } from 'react-router-dom'
import '../assets/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js'
import { AVATAR_GRANDE } from '../data/assets.js'
import { PLATOS } from '../data/favoritos.js'

// "to" = página que existe en la app React. Sin "to" = todavía no hay ruta (muestra un aviso).
const MENU = [
  { clave: 'descubrir', etiqueta: 'Descubrir', icono: 'bi-compass' },
  { clave: 'asistente', etiqueta: 'Asistente inteligente', icono: 'bi-stars' },
  { clave: 'dietas', etiqueta: 'Mis dietas y salud', icono: 'bi-heart-pulse-fill', to: '/perfil-clinico' },
  { clave: 'presupuesto', etiqueta: 'Mi presupuesto', icono: 'bi-cash-stack', to: '/presupuesto' },
  { clave: 'favoritos', etiqueta: 'Favoritos e historial', icono: 'bi-bookmark', iconoActivo: 'bi-bookmark-fill', to: '/favoritos' },
]

// Hace que en celular el menú se cierre al pulsar un enlace
const CIERRA_MENU = { 'data-bs-dismiss': 'offcanvas', 'data-bs-target': '#sidebar' }

export default function Sidebar({ activo, insignia, sorpresaIcono, sorpresaTexto, avisar }) {
  const sorprender = () => {
    const plato = PLATOS[Math.floor(Math.random() * PLATOS.length)]
    avisar('¡Sorpresa! Hoy te toca: ' + plato.titulo)
  }

  return (
    <aside className="offcanvas-lg offcanvas-start nd-sidebar" tabIndex="-1" id="sidebar" aria-label="Navegación principal">
      <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3 px-2">
              <span className="nd-logo"><i className="bi bi-egg-fried"></i></span>
              <div>
                <h1 className="nd-brand mb-0">QueComoHoy?</h1>
                <small className="text-body-secondary fw-bold">Plan Consciente</small>
              </div>
            </div>
            <button type="button" className="btn-close d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#sidebar" aria-label="Cerrar"></button>
          </div>

          <div className="nd-miniprofile d-flex align-items-center gap-3 p-3">
            <img className="nd-avatar-lg" alt="Valentina Ruiz" src={AVATAR_GRANDE} />
            <div className="min-w-0">
              <p className="fw-bold mb-0 text-truncate">Valentina Ruiz</p>
              {insignia}
            </div>
          </div>

          <nav className="nav flex-column gap-1" aria-label="Secciones">
            {MENU.map((item) => {
              const esActivo = item.clave === activo
              const clases = 'nd-nav' + (esActivo ? ' active' : '')
              const icono = esActivo && item.iconoActivo ? item.iconoActivo : item.icono
              return item.to ? (
                <Link key={item.clave} className={clases} to={item.to} aria-current={esActivo ? 'page' : undefined} {...CIERRA_MENU}>
                  <i className={`bi ${icono}`} />{item.etiqueta}
                </Link>
              ) : (
                <a key={item.clave} href="#" className={clases} {...CIERRA_MENU}
                   onClick={(e) => { e.preventDefault(); avisar(`"${item.etiqueta}" todavía no está en la versión React`) }}>
                  <i className={`bi ${icono}`} />{item.etiqueta}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="pt-3 border-top">
          <button className="btn nd-btn-gradient w-100 mb-2" onClick={sorprender}>
            <i className={`bi ${sorpresaIcono} me-2`}></i>{sorpresaTexto}
          </button>
          <Link className="nd-nav" to="/configuracion" {...CIERRA_MENU}><i className="bi bi-gear" />Ajustes</Link>
          <Link className="nd-nav text-danger" to="/" {...CIERRA_MENU}><i className="bi bi-box-arrow-right" />Cerrar sesión</Link>
        </div>
      </div>
    </aside>
  )
}
