import { useEffect, useRef, useState } from 'react'
import '../CSS/login.css'

const EMAIL_STORAGE_KEY = 'QueComoHoy:email'
const FOOD_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxto9fE84l3RN6VThmRG-kSTXldAPV0uZB708zs-lYeXc5qrhUQ5mGNL9tHOBHE2B_Ao5jgHszrUTm7iteSf4uFsWmrCgR-UBu3D_agBUTPccL1cZEfQfjRjLcOjDGcqEag5dkDE-EYEsbLyIPY8bQlQuVgiKbzBZXF0QHD1y7gijWnCpcNcirlacrtmMywbdqQuSdzPTUyniJqer9Jp72PzOI1pg11Sxt2MVKIIw2Dt3V9L_l107HdQ'

function getSavedEmail() {
  try {
    return localStorage.getItem(EMAIL_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export default function Inicio() {
  const [email, setEmail] = useState(getSavedEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [wasValidated, setWasValidated] = useState(false)
  const [formAlert, setFormAlert] = useState('')
  const [socialToast, setSocialToast] = useState('')
  const formRef = useRef(null)
  const emailRef = useRef(null)
  const rememberRef = useRef(null)
  const submitTimeoutRef = useRef(null)
  const toastTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      window.clearTimeout(submitTimeoutRef.current)
      window.clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  function handleSocialLogin(provider) {
    setSocialToast(`El acceso con ${provider} aún no está conectado.`)
    window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => {
      setSocialToast('')
    }, 2500)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFormAlert('')

    const form = formRef.current
    if (!form.checkValidity()) {
      setWasValidated(true)
      form.querySelector(':invalid')?.focus()
      return
    }

    setIsLoading(true)
    submitTimeoutRef.current = window.setTimeout(() => {
      try {
        if (rememberRef.current.checked) {
          localStorage.setItem(EMAIL_STORAGE_KEY, emailRef.current.value)
        } else {
          localStorage.removeItem(EMAIL_STORAGE_KEY)
        }
      } catch {
        // El almacenamiento local puede no estar disponible en algunos navegadores.
      }

      setIsLoading(false)
      setFormAlert('Sesión iniciada. Cargando tu plan culinario…')
    }, 1200)
  }

  return (
    <div>
      <header className="sh-header sticky-top">
        <div className="container-xxl d-flex align-items-center justify-content-between py-3 px-lg-5">
          <a
            href="#"
            className="d-flex align-items-center gap-3 text-decoration-none"
          >
            <span className="sh-logo">
              <i className="bi bi-egg-fried" />
            </span>
            <span className="d-flex flex-column lh-1">
              <span className="sh-brand">
                ¿<span>QueComoHoy</span>?
              </span>
              <small className="sh-tagline mt-1">
                NUTRICIÓN &amp; PLACER RESPONSABLE
              </small>
            </span>
          </a>
          <div className="d-flex align-items-center gap-2">
            <span className="sh-ssl d-none d-sm-inline-flex align-items-center gap-2">
              <i className="bi bi-patch-check-fill" /> Acceso Médico Seguro
              SSL-256
            </span>
            <a
              href="#"
              className="btn btn-link sh-link text-decoration-none fw-semibold"
            >
              <i className="bi bi-question-circle me-1" />
              <span className="d-none d-md-inline">Soporte Nutricional</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container-xxl flex-grow-1 d-flex align-items-center px-3 px-lg-5 py-4 py-lg-5">
        <div className="sh-card row g-0 w-100">
          <section className="col-lg-7 sh-hero p-4 p-sm-5 d-flex flex-column justify-content-between">
            <div className="sh-glow sh-glow-1" />
            <div className="sh-glow sh-glow-2" />

            <div className="position-relative">
              <span className="sh-pill">
                <span className="sh-dot" />
                Algoritmo Clínico &amp; Sensorial V3.4
              </span>
              <h1 className="sh-title mt-4">
                Come lo que amas,
                <br />
                <span className="sh-title-accent">
                  respeta lo que tu cuerpo necesita.
                </span>
              </h1>
              <p className="sh-lead mt-3">
                Personalización médica que no castiga tu paladar. Planifica
                banquetes adaptados a glucosa, celiaquía, perfil lipídico y
                presupuesto diario sin renunciar al antojo culposo del fin de
                semana.
              </p>
            </div>

            <div className="sh-showcase position-relative my-4">
              <img
                src={FOOD_IMAGE_URL}
                alt="Plato balanceado con salmón y vegetales"
                className="sh-photo"
              />
              <div className="sh-photo-shade" />

              <div className="sh-chip sh-chip-top">
                <span className="sh-chip-icon">
                  <i className="bi bi-cake2-fill" />
                </span>
                <div>
                  <small className="d-block sh-chip-label">Antojo del día</small>
                  <span className="fw-semibold">Brownie keto sin gluten</span>
                </div>
              </div>

              <div className="sh-chip sh-chip-bottom">
                <span className="sh-chip-icon sh-chip-green">
                  <i className="bi bi-check-circle-fill" />
                </span>
                <div>
                  <span className="d-block fw-semibold">
                    Apto para diabéticos &amp; celíacos
                  </span>
                  <small className="text-white-50">
                    Índice glucémico &lt; 25 •{' '}
                    <span className="sh-mint">0% gluten / TACC</span>
                  </small>
                </div>
              </div>

              <div className="sh-chip sh-chip-budget d-none d-sm-flex">
                <i className="bi bi-cash-coin fs-5" />
                <div>
                  <small className="d-block sh-chip-label">Presupuesto</small>
                  <span className="fw-bold">$4.50 / ración</span>
                </div>
              </div>
            </div>

            <div className="position-relative sh-hero-footer d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3">
              <div className="d-flex align-items-center gap-3">
                <div className="sh-avatars">
                  <span style={{ backgroundColor: '#d94f70' }}>JD</span>
                  <span style={{ backgroundColor: '#ad2d4d' }}>MC</span>
                  <span style={{ backgroundColor: '#517e62' }}>LG</span>
                </div>
                <small>
                  <strong className="text-white" data-counter="18400">
                    +18,400
                  </strong>{' '}
                  personas comen sin culpa ni recaídas.
                </small>
              </div>
              <small className="sh-rating">
                <i className="bi bi-star-fill me-1" />
                4.9/5 Avalado por nutricionistas clínicos
              </small>
            </div>
          </section>

          <section className="col-lg-5 bg-white p-4 p-sm-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="sh-badge">
                  Portal de pacientes &amp; gourmet
                </span>
                <a
                  href="#"
                  className="sh-link small fw-semibold text-decoration-none"
                >
                  ¿Ayuda?
                </a>
              </div>
              <h2 className="sh-form-title mt-3">Bienvenido a tu mesa</h2>
              <p className="text-body-secondary small">
                Ingresa tus credenciales para acceder a tus menús prescritos y
                recomendaciones del día.
              </p>

              <div className="row g-2 my-3">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn sh-btn-social w-100"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      className="me-2"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7c-.8 1.6-1.2 3.4-1.2 5.3s.4 3.7 1.2 5.3l3.7-2.9z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                        fill="#34A853"
                      />
                    </svg>
                    Google
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn sh-btn-social w-100"
                    onClick={() => handleSocialLogin('Apple ID')}
                  >
                    <i className="bi bi-apple me-2" />
                    Apple ID
                  </button>
                </div>
              </div>

              <div className="sh-divider my-3">
                <span>o con correo</span>
              </div>

              <form
                ref={formRef}
                className={wasValidated ? 'was-validated' : ''}
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label sh-label">
                    Correo electrónico
                  </label>
                  <div className="input-group sh-input">
                    <span className="input-group-text">
                      <i className="bi bi-envelope" />
                    </span>
                    <input
                      ref={emailRef}
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="ejemplo@salud.com"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <div className="invalid-feedback">
                      Ingresa un correo válido, por ejemplo nombre@dominio.com.
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="password"
                      className="form-label sh-label mb-1"
                    >
                      Contraseña
                    </label>
                    <a
                      href="#"
                      className="sh-link small text-decoration-none"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="input-group sh-input">
                    <span className="input-group-text">
                      <i className="bi bi-lock" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="••••••••••••"
                      required
                      minLength={8}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      className="btn sh-toggle"
                      aria-label={
                        showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                      }
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      <i
                        className={
                          showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                        }
                      />
                    </button>
                    <div className="invalid-feedback">
                      La contraseña debe tener al menos 8 caracteres.
                    </div>
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input
                    ref={rememberRef}
                    className="form-check-input sh-check"
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <label
                    className="form-check-label small text-body-secondary"
                    htmlFor="remember"
                  >
                    Recordar sesión en este equipo
                  </label>
                </div>

                {formAlert && (
                  <div
                    className="alert alert-success py-2 small"
                    role="status"
                  >
                    {formAlert}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn sh-btn-primary w-100"
                  disabled={isLoading}
                >
                  <span
                    className={`spinner-border spinner-border-sm me-2${isLoading ? '' : ' d-none'}`}
                    aria-hidden="true"
                  />
                  <span className="btn-text">
                    {isLoading
                      ? 'Ingresando…'
                      : 'Ingresar a mi plan culinario'}
                  </span>
                  <i
                    className={`bi bi-arrow-right ms-2 btn-arrow${isLoading ? ' d-none' : ''}`}
                  />
                </button>
              </form>

              <div className="sh-register mt-4 text-center">
                <strong className="d-block small">
                  ¿Aún no configuras tu perfil de salud?
                </strong>
                <p className="small text-body-secondary mb-3">
                  Crea tu cuenta gratis para calibrar tus alergias,
                  restricciones clínicas y presupuestos culinarios.
                </p>
                <a href="#" className="btn sh-btn-outline w-100">
                  <i className="bi bi-sliders me-2" />
                  Crear cuenta y calibrar mis gustos
                </a>
              </div>
            </div>

            <div className="sh-trust d-flex align-items-start gap-3 mt-4 pt-3">
              <span className="sh-trust-icon">
                <i className="bi bi-shield-fill-check" />
              </span>
              <p className="small text-body-secondary mb-0">
                <strong className="text-body">Privacidad garantizada:</strong>{' '}
                tus datos clínicos, biomarcadores y alergias están protegidos
                con cifrado de grado médico compatible con normativas HIPAA /
                GDPR.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="sh-footer mt-auto">
        <div className="container-xxl px-lg-5 py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex flex-column flex-sm-row align-items-center gap-3 text-center text-sm-start">
            <span className="sh-brand-sm">QueComoHoy?</span>
            <small className="text-body-secondary">
              © <span>{new Date().getFullYear()}</span> QueComoHoy?.
              Nutrición médica personalizada y placer culinario responsable.
              Todos los derechos reservados.
            </small>
          </div>
          <nav className="d-flex flex-wrap justify-content-center gap-3 small">
            <a href="#">Parámetros médicos</a>
            <a href="#">Alergias &amp; seguridad</a>
            <a href="#">Calculadora de presupuesto</a>
            <a href="#">Aviso legal &amp; privacidad</a>
            <a href="#">Contacto médico</a>
          </nav>
        </div>
      </footer>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className={`toast sh-toast${socialToast ? ' show' : ''}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="toast-body">{socialToast}</div>
        </div>
      </div>
    </div>
  )
}
