import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/registrarse.css'

const RESTRICTIONS = [
  'Sin Gluten / Celíaco',
  'Sin Lactosa',
  'Bajo en FODMAP',
  'Vegano / Vegetariano',
  'Ninguna alergia clínica',
]

const INITIAL_RESTRICTIONS = ['Sin Gluten / Celíaco']

function getPasswordRequirements(password) {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  }
}

function getPasswordStrength(password, requirements) {
  if (!password) return { label: 'Sin evaluar', level: 'empty', score: 0 }

  const score = Object.values(requirements).filter(Boolean).length
  const levels = ['empty', 'low', 'medium', 'high']
  const labels = ['Sin evaluar', 'Baja', 'Media', 'Alta']

  return { label: labels[score], level: levels[score], score }
}

function Requirement({ valid, children }) {
  return (
    <span className={`requirement${valid ? ' valid' : ''}`}>
      <span className="material-symbols-outlined">check</span>
      {children}
    </span>
  )
}

export default function Registrarse() {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialGoal: 'allergy',
  })
  const [restrictions, setRestrictions] = useState(INITIAL_RESTRICTIONS)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [healthConsent, setHealthConsent] = useState(true)
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [message, setMessage] = useState(null)

  const requirements = getPasswordRequirements(values.password)
  const strength = getPasswordStrength(values.password, requirements)
  const passwordsMatch =
    values.confirmPassword.length > 0 &&
    values.password === values.confirmPassword
  const confirmPasswordInvalid =
    wasSubmitted
      ? !values.confirmPassword || !passwordsMatch
      : values.confirmPassword.length > 0 && !passwordsMatch

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setMessage(null)
  }

  function toggleRestriction(restriction) {
    setRestrictions((current) =>
      current.includes(restriction)
        ? current.filter((item) => item !== restriction)
        : [...current, restriction],
    )
    setMessage(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setWasSubmitted(true)

    const form = event.currentTarget
    const valid = form.checkValidity() && passwordsMatch
    if (!valid) {
      setMessage({
        type: 'danger',
        text: 'Revisa los campos marcados antes de continuar.',
      })
      return
    }

    setMessage({
      type: 'success',
      text: '¡Formulario validado! El diseño está listo, pero para crear cuentas reales debes conectar este formulario con un backend o servicio de autenticación.',
    })
  }

  function showSocialMessage(provider) {
    const messageText =
      provider === 'Google'
        ? 'El registro con Google requiere configurar la autenticación OAuth.'
        : 'El registro con Apple requiere configurar la autenticación correspondiente.'

    setMessage({ type: 'info', text: messageText })
  }

  return (
    <>
      <header className="site-header sticky-top">
        <div className="container-fluid page-container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-3">
            <Link
              className="brand text-decoration-none"
              to="/"
              aria-label="QueComoHoy, inicio"
            >
              <span className="brand-icon material-symbols-outlined">spa</span>
              <span className="brand-copy">
                <span className="brand-name">QueComoHoy?</span>
                <span className="brand-subtitle">Plan Consciente</span>
              </span>
            </Link>

            <div className="compliance-badge d-none d-lg-flex align-items-center gap-2">
              <span className="material-symbols-outlined">verified_user</span>
              <span>Certificado HIPAA &amp; GDPR de Salud Nutricional</span>
            </div>
          </div>

          <div className="login-prompt d-flex align-items-center gap-2">
            <span className="d-none d-sm-inline">¿Ya tienes cuenta?</span>
            <Link className="btn btn-login" to="/">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      <main
        id="inicio"
        className="container-fluid page-container main-content py-4 py-lg-5"
      >
        <div className="row g-4 align-items-start">
          <aside className="col-12 col-lg-5 order-2 order-lg-1">
            <div className="hero-card mb-4">
              <div className="hero-glow" aria-hidden="true" />
              <div className="hero-content">
                <div className="hero-pill mb-3">
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                  <span>Nutrición Clínica &amp; Precisión Presupuestaria</span>
                </div>

                <h1 className="hero-title mb-3">
                  Comienza a comer bien sin incertidumbre clínica ni fatiga de
                  decisión.
                </h1>
                <p className="hero-description mb-4">
                  Únete a más de 18,000 personas que han transformado su relación
                  con la comida sin riesgos para su salud ni gastos innecesarios.
                </p>

                <div className="social-proof d-flex align-items-center gap-3">
                  <div className="avatar-group" aria-hidden="true">
                    <span className="avatar avatar-one">DR</span>
                    <span className="avatar avatar-two">LM</span>
                    <span className="avatar avatar-three">FC</span>
                  </div>
                  <div>
                    <div className="rating-line d-flex align-items-center gap-1">
                      <span className="material-symbols-outlined rating-star">
                        star
                      </span>
                      <strong>4.9/5</strong>
                      <span className="review-count">(1.2k+ reseñas)</span>
                    </div>
                    <p className="social-proof-caption mb-0">
                      Avalado por nutricionistas clínicos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card card mb-4">
              <div className="card-body">
                <div className="row g-3 align-items-center">
                  <div className="col-12 col-sm-auto">
                    <img
                      className="testimonial-image"
                      alt="Plato mediterráneo equilibrado"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMwTjr9skHxrmaCvbLh-Xj7RoC6d5s8slJvpHrP0nxXXUP47kugbFWPlSLKADJzp7xOh1pKDc0jhUAG-zUbyCPyjcByvuNvuVAJ5sgsTlfnnfqzaxrHsy4Adrh3zs-T47qUxe7weDJ6KLi7iQD0JsQRiou4U_RF3Jm-MFmrEB4r8jShuyeI0zYS9GVBlocAO4-RAnICQX9cYtvF8K20v4OTi1zc_3rO_s-grTpZRZk"
                    />
                  </div>
                  <div className="col">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                      <span className="gluten-badge">
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                        100% libre de gluten
                      </span>
                      <span className="meal-price">$3.80 / ración</span>
                    </div>
                    <h2 className="testimonial-title">
                      Bowl Mediterráneo Antiinflamatorio
                    </h2>
                    <p className="testimonial-copy mb-2">
                      “Eliminó mis crisis de hinchazón por celiaquía y me ahorra
                      más de $120 al mes en compras.”
                    </p>
                    <span className="testimonial-author">
                      Clara R. — Celíaca diagnosticada
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits-card">
              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-green">
                  <span className="material-symbols-outlined">
                    health_and_safety
                  </span>
                </div>
                <div>
                  <h3>Algoritmo de descarte clínico estricto</h3>
                  <p>
                    Protección en tiempo real contra reactivos, trazas cruzadas
                    y picos glucémicos.
                  </p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-orange">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <h3>Planificación presupuestaria integrada</h3>
                  <p>
                    Calcula listas de compra precisas maximizando el ahorro sin
                    sacrificar micronutrientes.
                  </p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-pink">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h3>Menús en menos de 30 segundos</h3>
                  <p>
                    Cero estrés diario ni fatiga por decidir qué almorzar o
                    cenar.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="col-12 col-lg-7 order-1 order-lg-2">
            <div className="signup-card">
              <div className="section-heading mb-4">
                <div className="step-label">
                  <span className="material-symbols-outlined">badge</span>
                  Paso 1 de 2: Acceso Rápido
                </div>
                <h2>Crea tu cuenta gratuita</h2>
                <p>
                  Configura tu perfil clínico y sensorial en menos de 2 minutos.
                </p>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <button
                    className="btn btn-social w-100"
                    id="googleSignup"
                    type="button"
                    onClick={() => showSocialMessage('Google')}
                  >
                    <svg
                      className="social-logo"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Registrarse con Google
                  </button>
                </div>
                <div className="col-12 col-sm-6">
                  <button
                    className="btn btn-social w-100"
                    id="appleSignup"
                    type="button"
                    onClick={() => showSocialMessage('Apple')}
                  >
                    <svg
                      className="social-logo apple-logo"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.68-1.09 1.77-.95 2.83 1.02.08 2.05-.51 2.68-1.28z" />
                    </svg>
                    Registrarse con Apple
                  </button>
                </div>
              </div>

              <div className="form-divider mb-4">
                <span>o regístrate con tu correo</span>
              </div>

              <form
                id="signupForm"
                noValidate
                className={wasSubmitted ? 'was-validated' : ''}
                onSubmit={handleSubmit}
              >
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" htmlFor="firstName">
                      Nombre
                    </label>
                    <div className="input-icon-wrap">
                      <input
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Elena"
                        autoComplete="given-name"
                        required
                        value={values.firstName}
                        onChange={updateValue}
                      />
                      <span className="material-symbols-outlined input-icon">
                        person
                      </span>
                    </div>
                    <div className="invalid-feedback">Ingresa tu nombre.</div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" htmlFor="lastName">
                      Apellido
                    </label>
                    <input
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Morales"
                      autoComplete="family-name"
                      required
                      value={values.lastName}
                      onChange={updateValue}
                    />
                    <div className="invalid-feedback">Ingresa tu apellido.</div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <div className="input-icon-wrap">
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="elena.morales@ejemplo.com"
                      autoComplete="email"
                      required
                      value={values.email}
                      onChange={updateValue}
                    />
                    <span className="material-symbols-outlined input-icon">
                      mail
                    </span>
                  </div>
                  <div className="invalid-feedback">
                    Ingresa un correo electrónico válido.
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" htmlFor="password">
                      Contraseña
                    </label>
                    <div className="input-icon-wrap">
                      <input
                        className="form-control password-input"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        value={values.password}
                        onChange={updateValue}
                      />
                      <span className="material-symbols-outlined input-icon">
                        lock
                      </span>
                    </div>
                    <div className="invalid-feedback">
                      La contraseña debe tener al menos 8 caracteres.
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </label>
                    <div className="input-icon-wrap">
                      <input
                        className={`form-control password-input${confirmPasswordInvalid ? ' is-invalid' : ''}${passwordsMatch ? ' is-valid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        required
                        value={values.confirmPassword}
                        onChange={updateValue}
                      />
                      <span className="material-symbols-outlined input-icon">
                        lock_reset
                      </span>
                    </div>
                    <div className="invalid-feedback" id="confirmPasswordFeedback">
                      {values.confirmPassword && values.password !== values.confirmPassword
                        ? 'Las contraseñas no coinciden.'
                        : 'Confirma tu contraseña.'}
                    </div>
                  </div>
                </div>

                <div className="password-meter mb-4" aria-live="polite">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="password-meter-title">
                      Seguridad de la clave:
                    </span>
                    <strong
                      id="passwordStrengthLabel"
                      className={`strength-label strength-${strength.level}`}
                    >
                      {strength.label}
                    </strong>
                  </div>
                  <div className="strength-bars" aria-hidden="true">
                    {[0, 1, 2].map((index) => (
                      <span
                        key={index}
                        className={`strength-bar${index < strength.score ? ' active' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="password-requirements">
                    <Requirement valid={requirements.length}>
                      {' '}Min. 8 caracteres
                    </Requirement>
                    <Requirement valid={requirements.number}>
                      {' '}Un número
                    </Requirement>
                    <Requirement valid={requirements.symbol}>
                      {' '}Un símbolo (@!#$)
                    </Requirement>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="initialGoal">
                    Objetivo primordial para tu plan
                  </label>
                  <div className="select-wrap">
                    <select
                      className="form-select"
                      id="initialGoal"
                      name="initialGoal"
                      value={values.initialGoal}
                      onChange={updateValue}
                    >
                      <option value="allergy">
                        Control clínico de alergia, celiaquía o intolerancias
                      </option>
                      <option value="budget">
                        Ahorro estricto y recetas express sin desperdicio
                      </option>
                      <option value="antiinflammatory">
                        Alimentación antiinflamatoria y salud metabólica
                      </option>
                      <option value="digestion">
                        Optimización digestiva y protocolo bajo en FODMAP
                      </option>
                      <option value="family">
                        Planificación familiar saludable y variada
                      </option>
                    </select>
                    <span className="material-symbols-outlined select-icon">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="diet-section pt-2 mb-4">
                  <span className="form-label mb-2 d-block">
                    Restricción alimentaria inmediata{' '}
                    <span className="form-hint">(puedes modificarla luego)</span>
                  </span>
                  <div className="d-flex flex-wrap gap-2" id="chipContainer">
                    {RESTRICTIONS.map((restriction) => {
                      const selected = restrictions.includes(restriction)
                      return (
                        <button
                          key={restriction}
                          className={`diet-chip${selected ? ' is-selected' : ''}`}
                          data-value={restriction}
                          aria-pressed={selected}
                          type="button"
                          onClick={() => toggleRestriction(restriction)}
                        >
                          {restriction}
                        </button>
                      )
                    })}
                  </div>
                  <input
                    type="hidden"
                    name="dietRestrictions"
                    id="dietRestrictions"
                    value={restrictions.join(', ')}
                    readOnly
                  />
                </div>

                <div className="legal-checks pt-3 mb-4">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(event) => setTermsAccepted(event.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      Acepto los{' '}
                      <Link to="/#terminos">Términos de Servicio</Link> y la{' '}
                      <Link to="/#privacidad">Política de Privacidad</Link> de
                      QueComoHoy?.
                    </label>
                    <div className="invalid-feedback">
                      Debes aceptar los términos para continuar.
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="healthConsent"
                      name="healthConsent"
                      type="checkbox"
                      checked={healthConsent}
                      onChange={(event) =>
                        setHealthConsent(event.target.checked)
                      }
                    />
                    <label className="form-check-label" htmlFor="healthConsent">
                      Doy mi consentimiento para el tratamiento seguro y
                      encriptado de mis datos de salud nutricional para fines de
                      descarte de alérgenos (opcional).
                    </label>
                  </div>
                </div>

                {message && (
                  <div
                    id="formMessage"
                    className={`alert alert-${message.type}`}
                    role="alert"
                  >
                    {message.text}
                  </div>
                )}

                <div className="pt-2">
                  <button className="btn btn-primary-custom w-100" type="submit">
                    <span>Crear Cuenta y Comenzar Onboarding</span>
                    <span className="material-symbols-outlined button-arrow">
                      arrow_forward
                    </span>
                  </button>
                </div>

                <p className="privacy-note text-center mt-3 mb-0">
                  <span className="material-symbols-outlined">shield_lock</span>
                  Tus datos médicos nunca se venderán ni compartirán con
                  anunciantes ni terceros.
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container-fluid page-container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="footer-brand">
            <strong>QueComoHoy?</strong>
            <span className="footer-dot">•</span>
            <span>© 2025 Plan Consciente. Todos los derechos reservados.</span>
          </div>
          <nav
            className="footer-nav d-flex flex-wrap justify-content-center gap-3 gap-lg-4"
            aria-label="Enlaces de pie de página"
          >
            <Link to="/#soporte">Soporte Nutricional</Link>
            <Link to="/#terminos">Términos Legales</Link>
            <Link to="/#parametros">Parámetros Clínicos &amp; Algoritmo</Link>
            <Link to="/#privacidad">Aviso de Privacidad</Link>
            <Link to="/#cookies">Seguridad de Datos</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
