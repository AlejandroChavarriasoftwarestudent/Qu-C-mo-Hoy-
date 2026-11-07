import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js'
import '../CSS/Perfilclinico.css'

const INITIAL_TAGS = [
  { id: 1, name: 'Mariscos crudos', icon: 'bi-water nd-text-secondary' },
  { id: 2, name: 'Picante extremo (capsaicina)', icon: 'bi-fire nd-text-primary' },
  { id: 3, name: 'Alcohol destilado', icon: 'bi-cup-straw nd-text-secondary' },
]

const SYMPTOM_LEVELS = {
  ok: {
    className: '',
    icon: 'bi bi-check-circle-fill nd-text-green fs-4',
    title: 'Todo en orden • Digestión ligera',
    text: '0 molestias ni hinchazón postprandial registradas.',
    streak: '7 días sin incidentes',
  },
  mild: {
    className: 'is-mild',
    icon: 'bi bi-exclamation-circle-fill text-warning fs-4',
    title: 'Molestia leve registrada',
    text: 'Revisa si hubo contaminación cruzada o ingredientes nuevos.',
    streak: 'Racha reiniciada',
  },
  severe: {
    className: 'is-severe',
    icon: 'bi bi-exclamation-triangle-fill nd-text-primary fs-4',
    title: 'Síntomas fuertes registrados',
    text: 'Contacta a tu gastroenteróloga y conserva el detalle de lo que comiste.',
    streak: 'Racha reiniciada',
  },
}

export default function PerfilClinico() {
  const [tags, setTags] = useState(INITIAL_TAGS)
  const [tagInput, setTagInput] = useState('')
  const [search, setSearch] = useState('')
  const [zeroTraces, setZeroTraces] = useState(true)
  const [symptomLevel, setSymptomLevel] = useState('ok')
  const [activeNavigation, setActiveNavigation] = useState('Mis dietas y salud')
  const [toastMessage, setToastMessage] = useState('')
  const toastTimeoutRef = useRef(null)
  const tagInputRef = useRef(null)
  const status = SYMPTOM_LEVELS[symptomLevel]

  useEffect(() => {
    return () => window.clearTimeout(toastTimeoutRef.current)
  }, [])

  function notify(message) {
    setToastMessage(message)
    window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(''), 2500)
  }

  function addTag(event) {
    event.preventDefault()
    const name = tagInput.trim()
    if (!name) {
      tagInputRef.current?.focus()
      return
    }

    setTags((currentTags) => [
      ...currentTags,
      { id: Date.now(), name, icon: 'bi-slash-circle nd-text-secondary' },
    ])
    setTagInput('')
  }

  function selectSymptom(level) {
    setSymptomLevel(level)
    notify('Registro guardado en tu bitácora.')
  }

  function handleSurprise() {
    const ideas = [
      'Bowl de quinoa y aguacate',
      'Salmón al romero con batata',
      'Crema de calabaza y jengibre',
    ]
    notify(`Prueba hoy: ${ideas[Math.floor(Math.random() * ideas.length)]}`)
  }

  function focusTagInput() {
    tagInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    tagInputRef.current?.focus()
  }

  function handleNavigation(event, label) {
    event.preventDefault()
    setActiveNavigation(label)
  }

  return (
    <>
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
          <img className="nd-avatar-lg" alt="Valentina Ruiz" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASCMto98hM2Cp55yvpe08p-2sAI-ee5-lFIZGRi7QAcyrKguhLBAw5pVbKPhHt1ueyxQouprNeI8Ysic1NarGCqWTiuKdkNOt0Ow3oCVTHLsSDfErGfdD_TnVQAdr8va-PWAUqBr6IJrAIaC_B1FTPX9phY6zmugqZb3zGF7iEwYkTCRtTC9onk-wa-kdrrJMBuVi284f8JaTRaT_kNqy1UcdLS_h2uHDnkakUvf2wWELxhDsLN4BBZA" />
          <div className="min-w-0">
            <p className="fw-bold mb-0 text-truncate">Valentina Ruiz</p>
            <small className="nd-text-primary fw-semibold"><span className="nd-dot"></span> Libre de gluten</small>
          </div>
        </div>

        <nav className="nav flex-column gap-1">
          {['Descubrir', 'Asistente inteligente', 'Mis dietas y salud', 'Mi presupuesto', 'Favoritos e historial'].map((label, index) => {
            const icons = ['bi-compass', 'bi-stars', 'bi-heart-pulse-fill', 'bi-cash-stack', 'bi-bookmark']
            const isActive = activeNavigation === label
            return (
              <Link
                key={label}
                className={`nd-nav${isActive ? ' active' : ''}`}
                to="#"
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleNavigation(event, label)}
              >
                <i className={`bi ${icons[index]}`} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-3 border-top">
        <button className="btn nd-btn-gradient w-100 mb-2" onClick={handleSurprise}><i className="bi bi-dice-5 me-2"></i>Sorpréndeme</button>
        <Link
          className={`nd-nav${activeNavigation === 'Ajustes' ? ' active' : ''}`}
          to="#"
          aria-current={activeNavigation === 'Ajustes' ? 'page' : undefined}
          onClick={(event) => handleNavigation(event, 'Ajustes')}
        >
          <i className="bi bi-gear" />
          Ajustes
        </Link>
        <Link
          className={`nd-nav text-danger${activeNavigation === 'Cerrar sesión' ? ' active' : ''}`}
          to="/"
          aria-current={activeNavigation === 'Cerrar sesión' ? 'page' : undefined}
          onClick={(event) => handleNavigation(event, 'Cerrar sesión')}
        >
          <i className="bi bi-box-arrow-right" />
          Cerrar sesión
        </Link>
      </div>
    </div>
  </aside>

  <div className="nd-content">
    {/* <!-- BARRA SUPERIOR --> */}
    <header className="nd-topbar sticky-top">
      <div className="d-flex align-items-center justify-content-between gap-3 px-3 px-lg-4 py-2">
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <button className="btn btn-light d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-label="Abrir menú"><i className="bi bi-list fs-5"></i></button>
          <div className="nd-search position-relative">
            <i className="bi bi-search"></i>
            <input type="search" className="form-control" id="searchInput" placeholder="Buscar alérgenos, ingredientes seguros..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
        </div>
        <nav className="d-none d-xl-flex gap-4">
          <Link className="nd-toplink" to="#">Hoy</Link>
          <Link className="nd-toplink" to="#">Semanario</Link>
          <Link className="nd-toplink" to="#">Despensa</Link>
        </nav>
        <div className="d-flex align-items-center gap-2">
          <span className="nd-budget d-none d-md-inline-flex"><i className="bi bi-wallet2"></i> Presupuesto: <strong>$24.50</strong></span>
          <button className="btn nd-icon-btn" aria-label="Notificaciones"><i className="bi bi-bell"></i></button>
          <button className="btn nd-icon-btn" aria-label="Favoritos"><i className="bi bi-heart"></i></button>
          <span className="vr d-none d-sm-block"></span>
          <button className="btn d-flex align-items-center gap-2 p-1 rounded-pill">
            <img className="nd-avatar-sm" alt="Valentina" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAiwU3kLJaL5grKqOg922BHUk02U6MxIiLI2OIQT2FbjhmwPwmSt5o1mL2TogyzQ_0raC1IofmXV7ZMcLHOdMNPoUIUEkahStJN_pa7iZu8Sb9G5jG3BDmZcUa6bzs9fwFj84yAdpBBL4anNY55JraySwwbFOlSRccN4jn4zPJmIlL6x7KBYDUASWx9gNzT40JnyrDb_Q8s-kYusu4L_wyY4dzgFuwhhw9i6H1J0cVFek0uFxnZiHp5Q" />
            <span className="fw-bold small d-none d-xxl-inline">Valentina</span>
          </button>
        </div>
      </div>
    </header>

    <main className="container-xxl px-3 px-lg-4 py-4 d-flex flex-column gap-4">

      {/* <!-- Encabezado --> */}
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
        <div>
          <div className="nd-text-primary fw-bold small mb-1"><i className="bi bi-patch-check me-1"></i>Perfil clínico y preferencias alimentarias</div>
          <h2 className="nd-h2 mb-1">Mis Dietas y Perfil Médico</h2>
          <p className="text-body-secondary mb-0">Gestiona tus intolerancias, restricciones clínicas y balance nutricional para recomendaciones 100% seguras.</p>
        </div>
        <div className="d-flex flex-wrap align-items-start gap-2">
          <button className="btn nd-btn-light" onClick={() => notify('Ficha nutricional lista para descargar (demo).')}><i className="bi bi-download me-2"></i>Exportar ficha nutricional</button>
          <button className="btn nd-btn-primary" onClick={focusTagInput}><i className="bi bi-plus-circle me-2"></i>Añadir restricción o alergia</button>
        </div>
      </div>

      {/* Banner de seguridad */}
      <section className="nd-banner p-3 p-md-4 d-flex flex-column flex-md-row justify-content-between gap-3">
        <div className="d-flex gap-3">
          <span className="nd-shield"><i className="bi bi-shield-check"></i></span>
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <h3 className="nd-h3 mb-0">Escudo activo: filtro clínico estricto 100% activado</h3>
              <span className="badge nd-badge-green"><span className="nd-dot nd-dot-green"></span> Certificado sin trazas</span>
            </div>
            <p className="text-body-secondary mt-1 mb-0">Ninguna receta sugerida contendrá <strong className="nd-text-primary">gluten</strong> ni trazas detectadas en base de datos. Protocolo de contaminación cruzada activo para utensilios y manufactura.</p>
          </div>
        </div>
        <div className="d-flex flex-md-column flex-lg-row align-items-md-end align-items-lg-center gap-2 text-nowrap">
          <small className="text-body-secondary fw-bold">Revisado médica: 14 ene 2025</small>
          <button className="btn btn-link nd-text-primary fw-bold p-0 text-decoration-none" data-bs-toggle="modal" data-bs-target="#certModal">Ver certificado <i className="bi bi-chevron-right"></i></button>
        </div>
      </section>

      <div className="row g-4">
        {/* <!-- COLUMNA IZQUIERDA --> */}
        <section className="col-lg-7 d-flex flex-column gap-4">

          <div className="nd-panel p-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="nd-h3 mb-0"><i className="bi bi-exclamation-triangle nd-text-primary me-2"></i>Restricciones y alergias clínicas</h3>
              <span className="badge nd-badge-grey" id="restrictionCount">2 registradas</span>
            </div>

            <div className="nd-restriction nd-restriction-severe p-3" data-restriction>
              <div className="d-flex justify-content-between gap-3">
                <div className="d-flex gap-3">
                  <span className="nd-ricon bg-primary-nd"><i className="bi bi-slash-circle"></i></span>
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <h4 className="nd-h4 mb-0">Gluten / Enfermedad celíaca</h4>
                      <span className="badge nd-badge-red">Severa • Nivel 5</span>
                    </div>
                    <small className="text-body-secondary fw-semibold">Diagnóstico confirmado: biopsia intestinal (mayo 2022)</small>
                  </div>
                </div>
                <div className="form-check form-switch nd-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="zeroTraces" checked={zeroTraces} onChange={(event) => setZeroTraces(event.target.checked)} aria-label="Tolerancia cero trazas" />
                </div>
              </div>
              <div className="d-flex justify-content-between small pt-2 mt-3 border-top nd-border-red">
                <span className="nd-text-primary fw-semibold" id="zeroTracesLabel">
                  <i className={`bi ${zeroTraces ? 'bi-patch-check' : 'bi-exclamation-circle'} me-1`} />
                  {zeroTraces
                    ? 'Tolerancia cero trazas (< 5 ppm)'
                    : 'Trazas permitidas: desactivar solo con indicación médica'}
                </span>
                <span className="text-body-secondary">Revisión constante</span>
              </div>
            </div>

            <div className="nd-restriction p-3" data-restriction>
              <div className="d-flex justify-content-between gap-3">
                <div className="d-flex gap-3">
                  <span className="nd-ricon bg-coral-soft"><i className="bi bi-droplet"></i></span>
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <h4 className="nd-h4 mb-0">Lactosa</h4>
                      <span className="badge nd-badge-coral">Moderada</span>
                    </div>
                    <small className="text-body-secondary fw-semibold">Déficit secundario de lactasa por celiaquía</small>
                  </div>
                </div>
                <span className="badge nd-badge-coral-soft align-self-start"><i className="bi bi-sliders me-1"></i>Permitir fermentados</span>
              </div>
              <div className="d-flex flex-wrap justify-content-between gap-2 small pt-2 mt-3 border-top">
                <span className="text-body-secondary">Se aceptan: kéfir de cabra, quesos curados &gt; 12 meses, mantequilla ghee.</span>
                <button className="btn btn-link p-0 small fw-bold nd-text-secondary text-decoration-none">Ajustar umbral</button>
              </div>
            </div>

            <div>
              <span className="nd-eyebrow">Sensibilidades digestivas y preferencias de exclusión</span>
              <div className="d-flex flex-wrap gap-2 mt-2" id="tagList">
                {tags.map((tag) => (
                  <span
                    className="nd-tag"
                    key={tag.id}
                    style={{
                      outline:
                        search.trim() &&
                        tag.name.toLowerCase().includes(search.trim().toLowerCase())
                          ? '2px solid var(--nd-primary)'
                          : undefined,
                    }}
                  >
                    <i className={`bi ${tag.icon}`} />
                    {tag.name}
                    <button
                      type="button"
                      aria-label={`Eliminar ${tag.name}`}
                      onClick={() =>
                        setTags((currentTags) =>
                          currentTags.filter((currentTag) => currentTag.id !== tag.id),
                        )
                      }
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </span>
                ))}
              </div>
              <form className="d-flex gap-2 mt-2" id="tagForm" onSubmit={addTag}>
                <input ref={tagInputRef} type="text" className="form-control form-control-sm nd-field" id="tagInput" placeholder="Añadir ingrediente a excluir" maxLength={40} aria-label="Nuevo ingrediente" value={tagInput} onChange={(event) => setTagInput(event.target.value)} />
                <button className="btn btn-sm nd-btn-dashed" type="submit"><i className="bi bi-plus-lg me-1"></i>Añadir</button>
              </form>
            </div>

            <button className="btn nd-btn-row d-flex justify-content-between align-items-center text-start" data-bs-toggle="modal" data-bs-target="#crossModal">
              <span><i className="bi bi-diagram-3 nd-text-primary me-2"></i>Configurar advertencias de reactividad cruzada (avena, maíz, quinoa)</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="nd-panel p-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="nd-h3 mb-0"><i className="bi bi-flower1 nd-text-green me-2"></i>Estilo de vida y filosofía culinaria</h3>
              <span className="badge nd-badge-green">Activa</span>
            </div>
            <div className="nd-soft p-3 d-flex flex-column flex-md-row justify-content-between gap-3">
              <div>
                <span className="nd-eyebrow nd-text-green">Patrón alimentario principal</span>
                <h4 className="nd-h4 fs-5 mt-1">Dieta mediterránea antiinflamatoria</h4>
                <p className="text-body-secondary mb-0 small">Foco en grasas monoinsaturadas, polifenoles de oliva virgen extra y vegetales ricos en sulforafano para reparación de la mucosa gástrica.</p>
              </div>
              <button className="btn nd-btn-light align-self-start text-nowrap">Cambiar plan</button>
            </div>
            <div>
              <span className="nd-eyebrow">Pilares nutricionales aplicados</span>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <span className="nd-pill nd-pill-green"><i className="bi bi-check-circle"></i>Alta en fibra soluble</span>
                <span className="nd-pill nd-pill-green"><i className="bi bi-check-circle"></i>Baja en sodio (&lt; 2000 mg)</span>
                <span className="nd-pill nd-pill-green"><i className="bi bi-check-circle"></i>Rica en omega-3 (EPA/DHA)</span>
                <span className="nd-pill nd-pill-coral"><i className="bi bi-flower3"></i>Alimentos reales</span>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3 pt-3 border-top">
              <div className="d-flex gap-3">
                <i className="bi bi-dash-circle nd-text-secondary fs-5"></i>
                <div>
                  <p className="fw-semibold mb-0 small">Excluir ultraprocesados por defecto</p>
                  <small className="text-body-secondary">Rechaza recetas con conservantes sintéticos o aceites refinados</small>
                </div>
              </div>
              <div className="form-check form-switch nd-switch"><input className="form-check-input" type="checkbox" role="switch" defaultChecked aria-label="Excluir ultraprocesados" /></div>
            </div>
          </div>
        </section>

        {/* <!-- COLUMNA DERECHA --> */}
        <section className="col-lg-5 d-flex flex-column gap-4">
          <div className="nd-panel p-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="nd-h3 mb-0"><i className="bi bi-graph-up nd-text-secondary me-2"></i>Balance y metas de hoy</h3>
              <button className="btn btn-link p-0 small fw-bold nd-text-secondary text-decoration-none">Editar objetivos</button>
            </div>
            <div className="nd-soft p-3">
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="nd-eyebrow">Objetivo calórico</span>
                <span className="fs-5 fw-bold">1,850 <small className="fw-normal text-body-secondary">kcal</small></span>
              </div>
              <div className="progress nd-progress nd-progress-lg my-2" role="progressbar" aria-label="Calorías consumidas">
                <div className="progress-bar bg-primary-nd" style={{ width: '66%' }}></div>
              </div>
              <div className="d-flex justify-content-between small fw-semibold">
                <span>Consumido: <strong className="nd-text-primary">1,220 kcal</strong></span>
                <span className="text-body-secondary">Restante cena: <strong className="nd-text-green">630 kcal</strong></span>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              <span className="nd-eyebrow">Macronutrientes clave</span>
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1"><span><i className="nd-bullet bg-green-nd"></i>Proteínas magras</span><span>95 g <span className="fw-normal text-body-secondary">/ 115 g (82%)</span></span></div>
                <div className="progress nd-progress" role="progressbar" aria-label="Proteínas"><div className="progress-bar bg-green-nd" style={{ width: '82%' }}></div></div>
              </div>
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1"><span><i className="nd-bullet bg-gold"></i>Carbohidratos complejos (sin gluten)</span><span>130 g <span className="fw-normal text-body-secondary">/ 180 g (72%)</span></span></div>
                <div className="progress nd-progress" role="progressbar" aria-label="Carbohidratos"><div className="progress-bar bg-gold" style={{ width: '72%' }}></div></div>
              </div>
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1"><span><i className="nd-bullet bg-coral"></i>Grasas saludables y omega</span><span>42 g <span className="fw-normal text-body-secondary">/ 55 g (76%)</span></span></div>
                <div className="progress nd-progress" role="progressbar" aria-label="Grasas"><div className="progress-bar bg-coral" style={{ width: '76%' }}></div></div>
              </div>
            </div>

            <div className="nd-soft p-3 d-flex gap-3 small">
              <i className="bi bi-check2-circle nd-text-green fs-5"></i>
              <p className="mb-0"><strong>Objetivo clínico activo:</strong> mantenimiento energético, absorción de hierro y desinflamación intestinal continua.</p>
            </div>
          </div>

          <div className="nd-panel p-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="nd-h3 mb-0"><i className="bi bi-emoji-laughing nd-text-primary me-2"></i>Bienestar digestivo</h3>
              <small className={`fw-bold ${symptomLevel === 'ok' ? 'nd-text-green' : 'nd-text-primary'}`} id="streakLabel">
                <span className={`nd-dot ${symptomLevel === 'ok' ? 'nd-dot-green' : ''}`} /> {status.streak}
              </small>
            </div>
            <div className="nd-soft p-3 d-flex flex-column gap-3">
              <p className="small fw-semibold mb-0">¿Cómo te sentiste tras las comidas de ayer?</p>
              <div className={`nd-status d-flex align-items-center gap-3 p-3 ${status.className}`} id="digestiveStatus">
                <i className={status.icon} id="statusIcon" />
                <div>
                  <p className="fw-bold small mb-0" id="statusTitle">{status.title}</p>
                  <small className="text-body-secondary" id="statusText">{status.text}</small>
                </div>
              </div>
              <button className="btn nd-btn-light w-100 nd-text-secondary fw-bold" data-bs-toggle="modal" data-bs-target="#symptomModal"><i className="bi bi-pencil-square me-2"></i>Registrar reacción digestiva o síntoma</button>
            </div>
            <div className="d-flex justify-content-between small text-body-secondary">
              <span><i className="bi bi-clipboard2-pulse me-1"></i>Dra. Lucía Méndez (gastroenteróloga)</span>
              <Link to="#" className="nd-text-primary fw-bold text-decoration-none">Compartir bitácora</Link>
            </div>
          </div>
        </section>
      </div>

      {/* <!-- Sugerencias --> */}
      <section className="nd-panel p-4 mb-3">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
          <div>
            <h3 className="nd-h3 mb-1">Sugerencias 100% compatibles para tu almuerzo</h3>
            <p className="text-body-secondary small mb-0">Filtradas sin gluten, aptas para baja lactosa y alineadas a tu meta de 630 kcal.</p>
          </div>
          <Link to="#" className="nd-text-primary fw-bold small text-decoration-none text-nowrap">Ver todas las recetas seguras <i className="bi bi-arrow-right"></i></Link>
        </div>
        <div className="row g-3">
          <div className="col-md-4"><article className="nd-meal">
            <div className="nd-meal-img"><img alt="Bowl mediterráneo de quinoa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyYws5Fys_aE-adxhuDD_sz2h4X7rc2d2oRcpMt-1GDeznVLVkSKHaGCU4tUFmdYK8baZ3VqwT1eDJviw2TG5fANsSLQaOXmJxrUzcJgcczs1s-DUwAiN_R4-HfsKfLCLt_2ub2PRKySlcc119FVUtahmxSrhyJle2zNjD6XDT5t79I1VKq0O0RdUMhiy5vir4M_l_yLEU5vZXCkQn99eK_vOWZx0uRC9DR6apWHpmCt7qKIucqkNdIw" />
              <span className="nd-chip-l">100% gluten free</span><span className="nd-chip-r">20 min</span></div>
            <div className="p-3"><h4 className="nd-h4 text-truncate">Bowl mediterráneo de quinoa y aguacate</h4>
              <div className="d-flex justify-content-between small text-body-secondary"><span>510 kcal • 24 g prot</span><span className="nd-text-green fw-bold">Seguridad total</span></div></div>
          </article></div>
          <div className="col-md-4"><article className="nd-meal">
            <div className="nd-meal-img"><img alt="Salmón al romero" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvo1Blb_qb_4an2d9WRAgr99arukFN6JqTp_BI0v2OeeV4Kwhck2ZXThifQwU4Yvt8FXh3sBvLNNXKqpzyG8J9GKjAs61ht2yABrPP5JBRFTV3Tnnc_TZnhRJ8_1E7rKAH_WOA6QYvwVGodV1naBhXUaj1Y_7pGcNqCHrrDlDqGy9wWOm1jRlc_Zl3ScO_jDm547078JjcWAbX6-p7MLiSEi5aybM48_0z_VHpBwQYgXlMn3dzuSmgcQ" />
              <span className="nd-chip-l">Rico en omega-3</span><span className="nd-chip-r">25 min</span></div>
            <div className="p-3"><h4 className="nd-h4 text-truncate">Salmón al romero con batata asada</h4>
              <div className="d-flex justify-content-between small text-body-secondary"><span>580 kcal • 38 g prot</span><span className="nd-text-green fw-bold">Antiinflamatorio</span></div></div>
          </article></div>
          <div className="col-md-4"><article className="nd-meal">
            <div className="nd-meal-img"><img alt="Crema de calabaza y jengibre" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6TlMYSCeaVSEChGmFW2g9mpZGctMswEiDdyk_Lwhcj3P5aHNDg5IryKObhpr1Osvzcuih-18-lj0raQJha7IiVwcGrDXdBiAZarFzUZe93ymvsc2h4MD8K_f2ASt-aa35C03DKUOOq8i7cvSTSPlk7tr30dqYZ-YtRxi8qSVoKz9_CP_7BrOA8vDuY5WM8NadcBC6n7HqHU4T7K3XhdYBtpv9GPAPJR6yWbzKV4oIXQ8JAltCS9sI8Q" />
              <span className="nd-chip-l">Digestión ligera</span><span className="nd-chip-r">15 min</span></div>
            <div className="p-3"><h4 className="nd-h4 text-truncate">Crema suave de calabaza y jengibre</h4>
              <div className="d-flex justify-content-between small text-body-secondary"><span>340 kcal • 11 g prot</span><span className="nd-text-green fw-bold">0 lactosa</span></div></div>
          </article></div>
        </div>
      </section>
    </main>
  </div>

  {/* <!-- Modales --> */}
  <div className="modal fade" id="symptomModal" tabIndex="-1" aria-labelledby="symptomTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered"><div className="modal-content nd-modal">
      <div className="modal-header border-0"><h5 className="modal-title fw-bold" id="symptomTitle">Registrar reacción digestiva</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button></div>
      <div className="modal-body pt-0">
        <p className="small text-body-secondary">¿Cómo te sentiste después de comer?</p>
        <div className="d-grid gap-2" id="symptomOptions">
          <button type="button" className="btn nd-btn-light text-start" data-bs-dismiss="modal" onClick={() => selectSymptom('ok')}><i className="bi bi-emoji-smile nd-text-green me-2"></i>Todo en orden</button>
          <button type="button" className="btn nd-btn-light text-start" data-bs-dismiss="modal" onClick={() => selectSymptom('mild')}><i className="bi bi-emoji-neutral nd-text-secondary me-2"></i>Molestia leve o hinchazón</button>
          <button type="button" className="btn nd-btn-light text-start" data-bs-dismiss="modal" onClick={() => selectSymptom('severe')}><i className="bi bi-emoji-frown nd-text-primary me-2"></i>Síntomas fuertes</button>
        </div>
      </div>
    </div></div>
  </div>

  <div className="modal fade" id="crossModal" tabIndex="-1" aria-labelledby="crossTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered"><div className="modal-content nd-modal">
      <div className="modal-header border-0"><h5 className="modal-title fw-bold" id="crossTitle">Reactividad cruzada</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button></div>
      <div className="modal-body pt-0">
        <p className="small text-body-secondary">Avisarme cuando una receta incluya:</p>
        <div className="form-check form-switch nd-switch mb-2"><input className="form-check-input" type="checkbox" role="switch" id="cx1" defaultChecked /><label className="form-check-label" htmlFor="cx1">Avena (aunque sea certificada)</label></div>
        <div className="form-check form-switch nd-switch mb-2"><input className="form-check-input" type="checkbox" role="switch" id="cx2" defaultChecked /><label className="form-check-label" htmlFor="cx2">Maíz</label></div>
        <div className="form-check form-switch nd-switch"><input className="form-check-input" type="checkbox" role="switch" id="cx3" /><label className="form-check-label" htmlFor="cx3">Quinoa</label></div>
      </div>
      <div className="modal-footer border-0"><button className="btn nd-btn-primary" data-bs-dismiss="modal">Guardar</button></div>
    </div></div>
  </div>

  <div className="modal fade" id="certModal" tabIndex="-1" aria-labelledby="certTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered"><div className="modal-content nd-modal">
      <div className="modal-header border-0"><h5 className="modal-title fw-bold" id="certTitle">Certificado de filtro clínico</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button></div>
      <div className="modal-body pt-0 small">Filtro sin gluten activo, con tolerancia cero trazas. Última revisión médica: 14 de enero de 2025, Dra. Lucía Méndez.</div>
    </div></div>
  </div>

  <div className="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="appToast" className={`toast nd-toast${toastMessage ? ' show' : ''}`} role="status" aria-live="polite" aria-atomic="true"><div className="toast-body">{toastMessage}</div></div>
  </div>
    </>
    )
}
