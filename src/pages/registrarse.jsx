import { signup } from '@netlify/identity'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authStatus } from '../data/auth'
import '../CSS/registrarse.css'

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
  })
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

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

  async function handleSubmit(event) {
    event.preventDefault()
    if (isLoading || confirmationSent) return
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

    setIsLoading(true)
    setMessage(null)
    try {
      const user = await signup(values.email.trim(), values.password, {
        full_name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      })
      if (!user.emailVerified) {
        setValues((current) => ({ ...current, password: '', confirmPassword: '' }))
        setWasSubmitted(false)
        setConfirmationSent(true)
      }
    } catch (error) {
      setMessage({
        type: 'danger',
        text: [400, 422].includes(authStatus(error))
          ? 'No se pudo crear la cuenta. Revisa tus datos o inicia sesión si ya tienes cuenta.'
          : 'No se pudo completar el registro. Inténtalo de nuevo más tarde.',
      })
    } finally {
      setIsLoading(false)
    }
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
                  Registro con correo
                </div>
                <h2>Crea tu cuenta gratuita</h2>
                <p>
                  Confirma tu correo para acceder a tu plan culinario.
                </p>
              </div>

              {confirmationSent ? (
                <div className="alert alert-success" role="status">
                  Revisa tu bandeja de entrada y abre el enlace para confirmar tu cuenta. Si no lo ves, revisa la carpeta de correo no deseado.
                </div>
              ) : <form
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
                  <button className="btn btn-primary-custom w-100" type="submit" disabled={isLoading}>
                    <span>{isLoading ? 'Creando cuenta…' : 'Crear cuenta'}</span>
                    <span className="material-symbols-outlined button-arrow" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </div>

              </form>}
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
