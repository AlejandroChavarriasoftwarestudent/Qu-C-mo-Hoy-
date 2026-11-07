import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/Confi.css'

const allergiesList = [
  {
    value: 'gluten',
    icon: 'bi-flower2 ob-c-primary',
    title: 'Gluten / Celíaco',
    description: 'Trigo, cebada, centeno y derivados procesados.',
    badge: 'Alerta clínica estricta',
    strict: true,
  },
  {
    value: 'lactosa',
    icon: 'bi-droplet ob-c-secondary',
    title: 'Lactosa / Lácteos',
    description: 'Leche de vaca, quesos blandos y crema.',
    badge: 'Tolerancia leve a fermentados',
  },
  {
    value: 'frutos-secos',
    icon: 'bi-basket ob-c-secondary',
    title: 'Frutos secos y maní',
    description: 'Nueces, avellanas, almendras, pistachos y cacahuate.',
  },
  {
    value: 'mariscos',
    icon: 'bi-water ob-c-secondary',
    title: 'Mariscos y crustáceos',
    description: 'Camarones, moluscos, calamares y pescados específicos.',
  },
  {
    value: 'huevo',
    icon: 'bi-egg ob-c-secondary',
    title: 'Huevo',
    description: 'Clara, yema y trazas presentes en emulsiones.',
  },
  {
    value: 'ninguna',
    icon: 'bi-check-circle ob-c-green',
    title: 'Ninguna alergia clínica',
    description: 'Sin restricciones de origen inmunológico o severo.',
  },
]

const dietOptions = [
  'Omnívoro consciente',
  'Mediterránea antiinflamatoria',
  'Vegetariana',
  'Vegana',
  'Keto / baja en carbos',
  'Sin ultraprocesados',
]

const storageKey = 'nutridecide:onboarding:paso2'

function saveAnswers(data) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // El almacenamiento de sesión puede estar deshabilitado en algunos navegadores.
  }
}

export default function Confi() {
  const [allergies, setAllergies] = useState(['gluten', 'lactosa'])
  const [conditions, setConditions] = useState([])
  const [conditionInput, setConditionInput] = useState('')
  const [showConditions, setShowConditions] = useState(false)
  const [diet, setDiet] = useState('Mediterránea antiinflamatoria')
  const [zeroTraces, setZeroTraces] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const conditionInputRef = useRef(null)
  const toastTimeoutRef = useRef(null)
  const saveTimeoutRef = useRef(null)
  const focusTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimeoutRef.current)
      window.clearTimeout(saveTimeoutRef.current)
      window.clearTimeout(focusTimeoutRef.current)
    }
  }, [])

  function notify(message) {
    setToast(message)
    window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => setToast(''), 2500)
  }

  function handleAllergyChange(value, checked) {
    if (value === 'ninguna') {
      setAllergies(checked ? ['ninguna'] : [])
      return
    }
    setAllergies((current) =>
      checked
        ? [...current.filter((item) => item !== 'ninguna'), value]
        : current.filter((item) => item !== value),
    )
  }

  function toggleConditions() {
    setShowConditions((open) => {
      if (!open) {
        window.clearTimeout(focusTimeoutRef.current)
        focusTimeoutRef.current = window.setTimeout(
          () => conditionInputRef.current?.focus(),
          200,
        )
      } else {
        window.clearTimeout(focusTimeoutRef.current)
      }
      return !open
    })
  }

  function addCondition(event) {
    event.preventDefault()
    const name = conditionInput.trim()
    if (!name) {
      conditionInputRef.current?.focus()
      return
    }
    setConditions((current) =>
      current.includes(name) ? current : [...current, name],
    )
    setAllergies((current) => current.filter((item) => item !== 'ninguna'))
    setConditionInput('')
    conditionInputRef.current?.focus()
  }

  function collectAnswers() {
    return {
      alergias: allergies,
      otras: conditions,
      enfoque: diet,
      ceroTrazas: zeroTraces,
    }
  }

  function saveAndContinue() {
    const answers = collectAnswers()
    if (!answers.alergias.length && !answers.otras.length) {
      notify('Selecciona al menos una opción o marca «Ninguna alergia clínica».')
      return
    }

    saveAnswers(answers)
    setIsSaving(true)
    window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = window.setTimeout(() => {
      setIsSaving(false)
      notify('Paso 2 guardado. Aquí iría el paso 3.')
    }, 900)
  }

  function saveAndExit() {
    saveAnswers(collectAnswers())
    notify('Progreso guardado. Puedes retomarlo cuando quieras.')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="ob-header sticky-top">
        <div
          className="container-xl d-flex align-items-center justify-content-between gap-3"
          style={{ height: '5rem' }}
        >
          <div className="d-flex align-items-center gap-3">
            <span className="ob-logo">
              <i className="bi bi-egg-fried" />
            </span>
            <div className="lh-sm">
              <span className="ob-brand d-block">QueComoHoy?</span>
              <small className="text-body-tertiary fw-semibold">
                Configuración inicial
              </small>
            </div>
          </div>

          <nav
            className="d-none d-md-flex align-items-center gap-2"
            aria-label="Progreso del asistente"
          >
            <div className="ob-step done">
              <span className="ob-num">
                <i className="bi bi-check-lg" />
              </span>
              <span>Objetivo</span>
            </div>
            <span className="ob-line done" />
            <div className="ob-step active" aria-current="step">
              <span className="ob-num">2</span>
              <span>Alergias y salud</span>
            </div>
            <span className="ob-line" />
            <div className="ob-step">
              <span className="ob-num">3</span>
              <span className="d-none d-lg-inline">Presupuesto y tiempo</span>
            </div>
            <span className="ob-line" />
            <div className="ob-step">
              <span className="ob-num">4</span>
              <span className="d-none d-lg-inline">Sabores y antojos</span>
            </div>
          </nav>

          <button className="btn ob-btn-ghost" type="button" onClick={saveAndExit}>
            Guardar y salir
          </button>
        </div>
        <div
          className="progress d-md-none ob-mobile-progress"
          role="progressbar"
          aria-label="Progreso"
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className="progress-bar" style={{ width: '50%' }} />
        </div>
      </header>

      <main className="container-xl flex-grow-1 py-4 py-sm-5">
        <div className="row g-4 align-items-start">
          <div className="col-lg-8">
            <div className="ob-card p-4 p-sm-5">
              <header className="mb-4">
                <span className="ob-tag">
                  <i className="bi bi-heart-pulse-fill" />
                  Seguridad clínica personalizada
                </span>
                <h1 className="ob-h1 mt-3 mb-2">
                  Cuidamos de ti: ¿tienes alguna intolerancia o condición médica?
                </h1>
                <p className="text-body-secondary mb-0">
                  Tu bienestar es primero. Excluiremos al 100% cualquier
                  ingrediente o preparación que represente un riesgo para tu
                  organismo.
                </p>
              </header>

              <section className="mb-5" aria-labelledby="h-alergenos">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="ob-h2 mb-0" id="h-alergenos">
                    <i className="bi bi-exclamation-triangle ob-c-primary me-2" />
                    Alérgenos e intolerancias médicas comunes
                  </h2>
                  <small className="text-body-tertiary fw-bold d-none d-sm-inline">
                    Selección múltiple
                  </small>
                </div>
                <div className="row g-3" id="allergyGrid">
                  {allergiesList.map((option) => (
                    <div className="col-sm-6" key={option.value}>
                      <label className={`ob-option h-100${option.strict ? ' strict' : ''}`}>
                        <input
                          className="form-check-input ob-check"
                          type="checkbox"
                          value={option.value}
                          checked={allergies.includes(option.value)}
                          onChange={(event) =>
                            handleAllergyChange(option.value, event.target.checked)
                          }
                        />
                        <span className="flex-fill">
                          <span className="ob-opt-title">
                            <i className={`bi ${option.icon}`} />
                            {option.title}
                          </span>
                          <small className="d-block text-body-secondary mb-2">
                            {option.description}
                          </small>
                          {option.badge === 'Alerta clínica estricta' && (
                            <span className="badge ob-badge-alert">
                              <i className="bi bi-exclamation-octagon me-1" />
                              {option.badge}
                            </span>
                          )}
                          {option.badge === 'Tolerancia leve a fermentados' && (
                            <span className="badge ob-badge-grey">
                              <span className="ob-bullet" />
                              {option.badge}
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-link ob-link p-0 mt-3"
                  id="toggleCustom"
                  aria-expanded={showConditions}
                  aria-controls="customCollapse"
                  onClick={toggleConditions}
                >
                  <i className={`bi ${showConditions ? 'bi-dash-circle' : 'bi-plus-circle'} me-1`} />
                  Añadir otra condición o medicamento (FODMAP, histamina,
                  diabetes...)
                </button>
                <div
                  className={`collapse${showConditions ? ' show' : ''}`}
                  id="customCollapse"
                >
                  <form className="d-flex gap-2 mt-2" id="customForm" onSubmit={addCondition}>
                    <input
                      ref={conditionInputRef}
                      type="text"
                      className="form-control ob-field"
                      id="customInput"
                      maxLength={50}
                      placeholder="Ej. histamina"
                      aria-label="Otra condición"
                      value={conditionInput}
                      onChange={(event) => setConditionInput(event.target.value)}
                    />
                    <button className="btn ob-btn-primary" type="submit">
                      Añadir
                    </button>
                  </form>
                  <div className="d-flex flex-wrap gap-2 mt-2" id="customList">
                    {conditions.map((condition) => (
                      <span className="ob-custom-chip" key={condition}>
                        {condition}
                        <button
                          type="button"
                          aria-label={`Quitar ${condition}`}
                          onClick={() =>
                            setConditions((current) =>
                              current.filter((item) => item !== condition),
                            )
                          }
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mb-5" aria-labelledby="h-dietas">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="ob-h2 mb-0" id="h-dietas">
                    <i className="bi bi-flower1 ob-c-green me-2" />
                    Enfoque nutricional o estilo preferido
                  </h2>
                  <small className="text-body-tertiary fw-bold d-none d-sm-inline">
                    Selecciona tu base
                  </small>
                </div>
                <div
                  className="d-flex flex-wrap gap-2"
                  id="dietPills"
                  role="radiogroup"
                  aria-labelledby="h-dietas"
                >
                  {dietOptions.map((option) => {
                    const selected = diet === option
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`ob-pill${selected ? ' active' : ''}`}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDiet(option)}
                      >
                        {selected && <i className="bi bi-check-lg" />}
                        {option}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="ob-shield p-3 p-sm-4 mb-5 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                <div className="d-flex gap-3">
                  <span className="ob-shield-icon">
                    <i className="bi bi-shield-fill-check" />
                  </span>
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <strong className="ob-h2">Escudo clínico cero trazas</strong>
                      <span className="badge ob-badge-green">Recomendado</span>
                    </div>
                    <p className="text-body-secondary mb-0 mt-1">
                      Excluye recetas con riesgo de contaminación cruzada o
                      ingredientes procesados en instalaciones compartidas.
                    </p>
                  </div>
                </div>
                <div className="form-check form-switch ob-switch flex-shrink-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="zeroTraces"
                    checked={zeroTraces}
                    onChange={(event) => setZeroTraces(event.target.checked)}
                    aria-label="Escudo clínico cero trazas"
                  />
                </div>
              </section>

              <footer className="pt-4 border-top d-flex flex-column-reverse flex-sm-row align-items-center justify-content-between gap-3">
                <button
                  type="button"
                  className="btn ob-btn-light w-100 w-sm-auto"
                  onClick={() => notify('Volverías al paso 1 (Objetivo).')}
                >
                  <i className="bi bi-arrow-left me-2" />
                  Atrás
                </button>
                <div className="d-none d-sm-block text-center lh-sm">
                  <small className="d-block fw-bold text-body-tertiary">
                    Paso 2 de 4
                  </small>
                  <small className="text-body-secondary">50% completado</small>
                </div>
                <div className="d-flex flex-column align-items-center align-items-sm-end w-100 w-sm-auto">
                  <button
                    type="button"
                    className="btn ob-btn-primary w-100 w-sm-auto py-3 px-4"
                    id="nextBtn"
                    disabled={isSaving}
                    onClick={saveAndContinue}
                  >
                    <span
                      className={`spinner-border spinner-border-sm me-2${isSaving ? '' : ' d-none'}`}
                      aria-hidden="true"
                    />
                    <span className="label">
                      {isSaving ? 'Guardando…' : 'Continuar a Presupuesto y Tiempo'}
                    </span>
                    <i className={`bi bi-arrow-right ms-2 arrow${isSaving ? ' d-none' : ''}`} />
                  </button>
                  <small className="text-body-tertiary mt-1">
                    Toma menos de 1 minuto
                  </small>
                </div>
              </footer>
            </div>
          </div>

          <aside className="col-lg-4 d-flex flex-column gap-4">
            <div className="ob-side p-4">
              <span className="ob-psy">
                <i className="bi bi-lightbulb-fill" />
              </span>
              <h3 className="ob-h2 mt-3">¿Por qué preguntamos esto?</h3>
              <p className="text-body-secondary">
                Nuestro algoritmo de decisión descarta más de{' '}
                <strong>14,000 variantes de recetas</strong> en tiempo real para
                que cocines sin incertidumbre, estrés ni cálculos médicos
                complejos.
              </p>
              <div className="d-flex align-items-center gap-3 pt-3 border-top">
                <span className="ob-mini">
                  <i className="bi bi-clipboard2-pulse" />
                </span>
                <div className="lh-sm">
                  <strong className="d-block small">Validado por nutriólogos</strong>
                  <small className="text-body-tertiary">
                    Protocolos basados en evidencia clínica
                  </small>
                </div>
              </div>
            </div>
            <div className="ob-side overflow-hidden">
              <div className="ob-side-img">
                <img
                  alt="Verduras mediterráneas, aceite de oliva y granos sin gluten sobre mármol"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8CPLlb4vfq2Kh7o8jrDs71O-5lAVX0lM-42o9A65iBQ_z1PHK7fDLAAMJBii8qZV0HarHCFYVs4qgSFzaZxqsf5Npj4fwBh3dBU2DNV5OMESv0YRwECEiUemVydbJOJoiODzIGiOK58hFEpFKs_LhgtkAvsTqRVuhAbKo-KqE_-YW-lMOHi6O9WxSlgmT2nu4UiPSMPlnUSklzRMdOQrxPPM66JfQ5Uep4bTgcVF3Qw2Och9Hg69w3g"
                />
              </div>
              <div className="p-4 pt-2">
                <div className="ob-c-green fw-bold small mb-1">
                  <i className="bi bi-heart-fill me-1" />
                  Comer bien sin privaciones
                </div>
                <p className="text-body-secondary mb-0">
                  Sustituiremos los ingredientes conflictivos con alternativas
                  gourmet que preservan todo el sabor.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="text-center small text-body-tertiary py-4 px-3">
        Tus datos de salud están encriptados y nunca serán compartidos con
        terceros.
        <span className="d-none d-sm-inline mx-2">•</span>
        <Link to="#" className="ob-foot-link">
          Aviso de privacidad médica
        </Link>
      </footer>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className={`toast ob-toast${toast ? ' show' : ''}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="toast-body">{toast}</div>
        </div>
      </div>
    </div>
  )
}