import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/vistas-6-7.css'
import Sidebar from '../components/Sidebar.jsx'
import PlatoCard from '../components/PlatoCard.jsx'
import useAviso from '../components/useAviso.jsx'
import { AVATAR_CHICO } from '../data/assets.js'
import { FILTROS, PLATOS, TABS } from '../data/favoritos.js'
import { apiFetch, getToken } from '../services/api.js'

const TIPOS_COMIDA = ['Desayuno', 'Almuerzo', 'Cena', 'Refrigerio']
const CLAVE_FAVORITOS = 'QueComoHoy:favoritos'

function fechaLocal() {
  const hoy = new Date()
  const zonaHoraria = hoy.getTimezoneOffset() * 60000
  return new Date(hoy.getTime() - zonaHoraria).toISOString().slice(0, 10)
}

function leerFavoritos() {
  const guardados = localStorage.getItem(CLAVE_FAVORITOS)
  return guardados ? JSON.parse(guardados) : PLATOS.map((plato) => plato.id)
}

// Baja suavemente hasta una sección (respeta "reducir movimiento")
const irA = (id) => {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' })
}

export default function Favoritos() {
  const [aviso, notify] = useAviso()
  const autenticado = Boolean(getToken())

  const [tab, setTab] = useState('favoritos');
  const [seccion, setSeccion] = useState('favoritos-sec');
  const [chips, setChips] = useState([]);                       // ej: ['eco', 'fast']
  const [texto, setTexto] = useState('');
  const [favs, setFavs] = useState(leerFavoritos)
  const [alimentosHoy, setAlimentosHoy] = useState([])
  const [historial, setHistorial] = useState([])
  const [fecha, setFecha] = useState(fechaLocal)
  const [alimentoForm, setAlimentoForm] = useState({
    nombre: '',
    tipoComida: 'Almuerzo',
    fecha: fechaLocal(),
    notas: '',
  })
  const [alimentoEditando, setAlimentoEditando] = useState(null)
  const [cargandoAlimentos, setCargandoAlimentos] = useState(autenticado)
  const [guardandoAlimento, setGuardandoAlimento] = useState(false)
  const [errorAlimentos, setErrorAlimentos] = useState('')

  const cargarAlimentos = useCallback(async () => {
    const [hoyData, historialData] = await Promise.all([
      apiFetch(`/api/alimentos/hoy?fecha=${fecha}`),
      apiFetch('/api/alimentos/historial'),
    ])
    setAlimentosHoy(hoyData.alimentos)
    setHistorial(historialData.alimentos)
  }, [fecha])

  useEffect(() => {
    if (!autenticado) return

    let activo = true
    Promise.all([
      apiFetch(`/api/alimentos/hoy?fecha=${fecha}`),
      apiFetch('/api/alimentos/historial'),
    ])
      .then(([hoyData, historialData]) => {
        if (!activo) return
        setAlimentosHoy(hoyData.alimentos)
        setHistorial(historialData.alimentos)
        setErrorAlimentos('')
      })
      .catch((error) => {
        if (activo) setErrorAlimentos(error.message)
      })
      .finally(() => {
        if (activo) setCargandoAlimentos(false)
      })

    return () => {
      activo = false
    }
  }, [autenticado, fecha])

  // Platos que se muestran según pestaña, filtros y buscador
  const visibles = PLATOS.filter((p) => {
    if (!p.titulo.toLowerCase().includes(texto.trim().toLowerCase())) return false;
    if (!chips.every((id) => FILTROS.find((f) => f.id === id).cumple(p))) return false;
    if (tab === 'express' && !(p.min < 15)) return false;
    return true;
  });

  const elegirTab = (id) => {
    setTab(id);
    irA(id === 'recientes' ? 'historial' : 'favoritos-sec');
  };
  const elegirSeccion = (estado, id) => { setSeccion(estado); irA(id); };
  const alternarChip = (id) => setChips((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const alternarCorazon = (plato) => {
    setFavs((actuales) => {
      const estaba = actuales.includes(plato.id)
      const siguientes = estaba
        ? actuales.filter((id) => id !== plato.id)
        : [...actuales, plato.id]
      localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(siguientes))
      notify(estaba ? 'Quitado de favoritos' : 'Agregado a favoritos')
      return siguientes
    })
  };

  const cambiarFecha = (nuevaFecha) => {
    setFecha(nuevaFecha)
    setAlimentoForm((actual) => ({ ...actual, fecha: nuevaFecha }))
  }

  const editarAlimento = (alimento) => {
    setAlimentoEditando(alimento._id)
    setAlimentoForm({
      nombre: alimento.nombre,
      tipoComida: alimento.tipoComida,
      fecha: alimento.fecha,
      notas: alimento.notas || '',
    })
  }

  const cancelarEdicion = () => {
    setAlimentoEditando(null)
    setAlimentoForm({
      nombre: '',
      tipoComida: 'Almuerzo',
      fecha,
      notas: '',
    })
  }

  const guardarAlimento = async (event) => {
    event.preventDefault()
    setGuardandoAlimento(true)
    setErrorAlimentos('')

    try {
      const editando = Boolean(alimentoEditando)
      await apiFetch(
        editando ? `/api/alimentos/${alimentoEditando}` : '/api/alimentos',
        {
          method: editando ? 'PUT' : 'POST',
          body: JSON.stringify(alimentoForm),
        },
      )
      cancelarEdicion()
      await cargarAlimentos()
      notify(editando ? 'Alimento actualizado' : 'Alimento registrado')
    } catch (error) {
      setErrorAlimentos(error.message)
    } finally {
      setGuardandoAlimento(false)
    }
  }

  const eliminarAlimento = async (id) => {
    if (!window.confirm('¿Eliminar este registro de alimento?')) return
    setErrorAlimentos('')

    try {
      await apiFetch(`/api/alimentos/${id}`, { method: 'DELETE' })
      await cargarAlimentos()
      notify('Registro eliminado')
    } catch (error) {
      setErrorAlimentos(error.message)
    }
  }

  return (
    <div className="app-nd">
      <Sidebar
        activo="favoritos"
        insignia={<span className="badge nd-badge-green" style={{ fontSize: '.7rem', padding: '.2rem .5rem' }}>Libre de Gluten</span>}
        sorpresaIcono="bi-dice-5"
        sorpresaTexto="¡Sorpréndeme!"
        avisar={notify}
      />

      <div className="nd-content">
        {/* BARRA SUPERIOR */}
        <header className="nd-topbar sticky-top">
          <div className="d-flex align-items-center justify-content-between gap-3 px-3 px-lg-4 py-2">
            <div className="d-flex align-items-center gap-2 flex-grow-1">
              <button className="btn btn-light d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-label="Abrir menú"><i className="bi bi-list fs-5"></i></button>
              <div className="nd-search position-relative" style={{ maxWidth: '34rem' }}>
                <i className="bi bi-search"></i>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar en platos guardados, ingredientes o historial..."
                  aria-label="Buscar"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link to="/presupuesto" className="nd-budget d-none d-md-inline-flex text-decoration-none py-1">
                <i className="bi bi-wallet2 nd-text-secondary fs-5"></i>
                <span className="lh-1">
                  <span className="d-block nd-cap" style={{ fontSize: '.62rem' }}>Presupuesto restante</span>
                  <strong>$42.50</strong> <span className="text-body-secondary">/ $120.00</span>
                </span>
              </Link>
              <button className="btn nd-icon-btn" aria-label="Notificaciones" onClick={() => notify('No tienes notificaciones nuevas')}>
                <i className="bi bi-bell"></i><span className="nd-ping"></span>
              </button>
              <span className="nd-text-primary fs-5 px-1" aria-label="Favoritos"><i className="bi bi-heart-fill"></i></span>
              <img className="nd-avatar-sm" alt="Valentina" src={AVATAR_CHICO} />
            </div>
          </div>

      {/* Pestañas con contador */}
      <div className="fv-tabs px-3 px-lg-4 py-2 overflow-x-auto">
        <ul className="nav flex-nowrap gap-1" aria-label="Filtro principal">
          {TABS.map((t) => (
            <li className="nav-item" key={t.id}>
              <button type="button" className={'nav-link' + (tab === t.id ? ' active' : '')} onClick={() => elegirTab(t.id)}>
                {t.icono && <i className={`bi ${t.icono}`}></i>}{t.label} <span className="fv-count">{t.n}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
        </header>

        <main className="container-xxl px-3 px-lg-4 py-4 d-flex flex-column gap-4">
      {/* Encabezado */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3">
        <div style={{ maxWidth: '42rem' }}>
          <span className="fv-eyebrow mb-2"><i className="bi bi-journal-richtext"></i>Repertorio Personalizado &amp; Nutrición Sin Estrés</span>
          <h2 className="nd-h1 mb-2">Favoritos e Historial Culinario</h2>
          <p className="text-body-secondary fs-6 mb-0">Tus recetas estrella guardadas y el registro de comidas que resolvieron tu día sin complicaciones ni estrés.</p>
        </div>
        <button className="btn nd-btn-primary fv-btn-plan px-4 py-3" type="button" onClick={() => notify('Menú semanal en construcción con tus favoritos')}>
          <i className="bi bi-calendar-week me-2"></i>Planificar Menú Semanal con Favoritos
        </button>
      </div>

      {/* Filtros */}
      <section className="fv-filters p-3" aria-label="Filtros">
        <ul className="nav fv-seg d-inline-flex mb-3">
          <li className="nav-item">
            <button type="button" className={'nav-link' + (seccion === 'favoritos-sec' ? ' active' : '')} onClick={() => elegirSeccion('favoritos-sec', 'favoritos-sec')}>Mis Favoritos Guardados (12)</button>
          </li>
          <li className="nav-item">
            <button type="button" className={'nav-link' + (seccion === 'historial' ? ' active' : '')} onClick={() => elegirSeccion('historial', 'historial')}>Historial de Elecciones (16)</button>
          </li>
        </ul>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="fv-chip is-on"><i className="bi bi-shield-check"></i>Sin Gluten (100%)</span>
          {FILTROS.map((f) => (
            <button key={f.id} type="button" aria-pressed={chips.includes(f.id)} className={'fv-chip' + (chips.includes(f.id) ? ' is-on-red' : '')} onClick={() => alternarChip(f.id)}>
              <i className={`bi ${f.icono}`}></i>{f.label}
            </button>
          ))}
          <button type="button" className="fv-chip-link" onClick={() => irA('patron')}><i className="bi bi-bar-chart-line me-1"></i>Ver Estadísticas de Acierto</button>
        </div>
      </section>

      {/* Platos estrella */}
      <section id="favoritos-sec" aria-labelledby="starTitle">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div className="d-flex align-items-center gap-3">
            <span className="fv-sec-icon"><i className="bi bi-star"></i></span>
            <div>
              <h3 className="nd-h3 mb-0" id="starTitle">Tus Platos Estrella</h3>
              <small className="text-body-secondary">Las recetas más repetidas y con mejor balance médico/emocional</small>
            </div>
          </div>
          <small className="text-body-secondary text-end" aria-live="polite">Mostrando {visibles.length} de 12 recetas guardadas</small>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-xxl-4 g-3">
          {visibles.map((p) => (
            <div className="col fv-col" key={p.id}>
              <PlatoCard
                plato={p}
                favorito={favs.includes(p.id)}
                alCorazon={alternarCorazon}
                alCocinar={(pl) => notify(`¡A cocinar! "${pl.titulo}" agregado a tu plan de hoy`)}
                alAviso={notify}
              />
            </div>
          ))}
        </div>
        {visibles.length === 0 && (
          <p className="text-center text-body-secondary py-4 mb-0">Ningún plato coincide con tu búsqueda o filtros.</p>
        )}
      </section>

      <section className="nd-panel p-3 p-xl-4" aria-labelledby="foodLogTitle">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
          <div>
            <h3 className="nd-h3 mb-1" id="foodLogTitle">Registro de alimentación</h3>
            <p className="text-body-secondary mb-0">Guarda y consulta los alimentos de tu cuenta.</p>
          </div>
          <label className="small">
            Consultar día
            <input
              className="form-control"
              type="date"
              value={fecha}
              onChange={(event) => cambiarFecha(event.target.value)}
              disabled={!autenticado}
            />
          </label>
        </div>

        {!autenticado ? (
          <div className="alert alert-info mb-0" role="status">
            <Link to="/">Inicia sesión</Link> para guardar y consultar tus alimentos.
          </div>
        ) : (
          <>
            <form className="row g-3 align-items-end mb-4" onSubmit={guardarAlimento}>
              <div className="col-md-4">
                <label className="form-label" htmlFor="foodName">Alimento o plato</label>
                <input
                  className="form-control"
                  id="foodName"
                  maxLength={120}
                  required
                  value={alimentoForm.nombre}
                  onChange={(event) => setAlimentoForm((actual) => ({ ...actual, nombre: event.target.value }))}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="foodMeal">Comida</label>
                <select
                  className="form-select"
                  id="foodMeal"
                  value={alimentoForm.tipoComida}
                  onChange={(event) => setAlimentoForm((actual) => ({ ...actual, tipoComida: event.target.value }))}
                >
                  {TIPOS_COMIDA.map((tipo) => <option key={tipo}>{tipo}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="foodDate">Fecha</label>
                <input
                  className="form-control"
                  id="foodDate"
                  type="date"
                  required
                  value={alimentoForm.fecha}
                  onChange={(event) => cambiarFecha(event.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="foodNotes">Notas (opcional)</label>
                <input
                  className="form-control"
                  id="foodNotes"
                  maxLength={500}
                  value={alimentoForm.notas}
                  onChange={(event) => setAlimentoForm((actual) => ({ ...actual, notas: event.target.value }))}
                />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn nd-btn-primary" type="submit" disabled={guardandoAlimento}>
                  {guardandoAlimento ? 'Guardando…' : alimentoEditando ? 'Guardar cambios' : 'Registrar alimento'}
                </button>
                {alimentoEditando && (
                  <button className="btn btn-outline-secondary" type="button" onClick={cancelarEdicion}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {errorAlimentos && <div className="alert alert-danger" role="alert">{errorAlimentos}</div>}

            <h4 className="nd-h3">Alimentación del día</h4>
            {cargandoAlimentos ? (
              <p role="status">Cargando tus registros…</p>
            ) : alimentosHoy.length ? (
              <div className="d-flex flex-column gap-2">
                {alimentosHoy.map((alimento) => (
                  <article className="fv-event" key={alimento._id}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <div>
                        <strong>{alimento.nombre}</strong>
                        <span className="text-body-secondary"> · {alimento.tipoComida}</span>
                        {alimento.notas && <p className="mb-0 text-body-secondary">{alimento.notas}</p>}
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => editarAlimento(alimento)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarAlimento(alimento._id)}>Eliminar</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-body-secondary mb-0">No hay alimentos registrados para esta fecha.</p>
            )}
          </>
        )}
      </section>

      {/* Historial + panel lateral */}
      <div className="row g-4">
        <section className="col-xl-8" id="historial" aria-labelledby="histTitle">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <span className="fv-sec-icon is-grey"><i className="bi bi-graph-up-arrow"></i></span>
              <div>
                <h3 className="nd-h3 mb-0" id="histTitle">Historial de Decisiones Recientes</h3>
                <small className="text-body-secondary">Momentos en que NutriDecide desbloqueó tu comida sin fricción</small>
              </div>
            </div>
            <button type="button" className="btn btn-link nd-text-primary fw-bold small text-decoration-none p-0 text-nowrap" onClick={() => window.print()}>
              <i className="bi bi-download me-1"></i>Exportar PDF
            </button>
          </div>

          {autenticado && !cargandoAlimentos && historial.length > 0 ? (
            <div className="fv-timeline">
              {historial.filter((alimento) => alimento.fecha !== fechaLocal()).map((alimento) => (
                <article className="fv-event" key={alimento._id}>
                  <span className="fv-when"><i className="bi bi-calendar3 me-1"></i>{new Date(`${alimento.fecha}T12:00:00`).toLocaleDateString()}</span>
                  <h4 className="fv-evtitle">{alimento.nombre}</h4>
                  <p className="text-body-secondary mb-3">{alimento.tipoComida}{alimento.notas ? ` · ${alimento.notas}` : ''}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => editarAlimento(alimento)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => eliminarAlimento(alimento._id)}>Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-body-secondary">
              {autenticado ? 'Aún no tienes alimentos registrados en fechas anteriores.' : 'Inicia sesión para consultar tu historial.'}
            </p>
          )}
        </section>

        <aside className="col-xl-4 d-flex flex-column gap-4">
          <section className="nd-panel p-3 p-xl-4" id="patron" aria-labelledby="patTitle">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="nd-h3 mb-0" id="patTitle"><i className="bi bi-bullseye nd-text-primary me-2"></i>Tu Patrón de Decisión</h3>
              <span className="badge" style={{ background: 'var(--nd-chip)', color: 'var(--nd-muted)' }}>Este Mes</span>
            </div>
            <p className="text-body-secondary">Cómo la inteligencia culinaria de NutriDecide reduce la fatiga mental y protege tu presupuesto familiar:</p>
            <div className="d-flex flex-column gap-3">
              <div className="fv-stat">
                <span className="nd-icon-box" style={{ background: '#ffdad3', color: 'var(--nd-primary)' }}><i className="bi bi-lightning-charge"></i></span>
                <div>
                  <div className="fv-stat-big">88%<small>{'de decisiones en < 1 min'}</small></div>
                  <p className="small text-body-secondary mb-0 mt-1">Eliminando la parálisis por análisis ante la nevera y el estrés de última hora.</p>
                </div>
              </div>
              <div className="fv-stat">
                <span className="nd-icon-box nd-ib-green"><i className="bi bi-basket3"></i></span>
                <div>
                  <div className="nd-cap" style={{ fontSize: '.66rem' }}>Ingrediente predilecto</div>
                  <div className="fw-bold">Quinoa &amp; Aguacate Fresco</div>
                  <p className="small text-body-secondary mb-0">Presente en el 42% de tus almuerzos con reporte de digestión óptima.</p>
                </div>
              </div>
              <div className="fv-stat">
                <span className="nd-icon-box nd-ib-coral"><i className="bi bi-bank"></i></span>
                <div>
                  <div className="fv-stat-big">+$284.50<small>Ahorro acumulado</small></div>
                  <p className="small text-body-secondary mb-0 mt-1">Comparado con alternativas de comida a domicilio o pedidos imprevistos.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="fv-pro p-3 p-xl-4" aria-labelledby="proTitle">
            <div className="d-flex align-items-center gap-2 mb-3 nd-text-primary fw-bold small text-uppercase"><i className="bi bi-lightbulb"></i>Recomendación proactiva</div>
            <h3 className="nd-h3 mb-3" id="proTitle" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>¿Quieres variar tu repertorio culinario esta semana?</h3>
            <p className="text-body-secondary">Descubrimos 3 recetas nuevas 100% compatibles con tu celiaquía y con ingredientes que ya tienes en tu despensa.</p>
            <button type="button" className="btn nd-btn-primary mt-2" onClick={() => notify('"Descubrir" todavía no está en la versión React')}>
              Explorar Nuevos Sabores <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </section>
        </aside>
      </div>
        </main>
      </div>

      {aviso}
    </div>
  )
}
