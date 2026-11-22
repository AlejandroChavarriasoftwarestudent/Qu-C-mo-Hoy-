import { login, requestPasswordRecovery } from '@netlify/identity'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authStatus } from '../data/auth'
import '../CSS/login.css'

const FOOD_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxto9fE84l3RN6VThmRG-kSTXldAPV0uZB708zs-lYeXc5qrhUQ5mGNL9tHOBHE2B_Ao5jgHszrUTm7iteSf4uFsWmrCgR-UBu3D_agBUTPccL1cZEfQfjRjLcOjDGcqEag5dkDE-EYEsbLyIPY8bQlQuVgiKbzBZXF0QHD1y7gijWnCpcNcirlacrtmMywbdqQuSdzPTUyniJqer9Jp72PzOI1pg11Sxt2MVKIIw2Dt3V9L_l107HdQ'

export default function Inicio({ callbackError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recovery, setRecovery] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [wasValidated, setWasValidated] = useState(false)
  const [formAlert, setFormAlert] = useState(callbackError ? { type: 'danger', text: callbackError } : null)

  function toggleRecovery() {
    setRecovery(!recovery)
    setPassword('')
    setFormAlert(null)
    setWasValidated(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isLoading) return
    setFormAlert(null)

    const form = event.currentTarget
    if (!form.checkValidity()) {
      setWasValidated(true)
      form.querySelector(':invalid')?.focus()
      return
    }

    setIsLoading(true)
    try {
      if (recovery) {
        await requestPasswordRecovery(email.trim())
      } else {
        await login(email.trim(), password)
      }
    } catch (error) {
      const status = authStatus(error)
      if (!recovery || ![400, 404, 422].includes(status)) {
        const rejected = [400, 401, 403, 422].includes(status)
        setFormAlert({
          type: 'danger',
          text: !recovery && rejected
            ? 'No pudimos iniciar sesión. Revisa tu correo y contraseña y confirma tu cuenta desde el enlace que te enviamos.'
            : 'No pudimos completar la solicitud. Inténtalo de nuevo en unos minutos.',
        })
        return
      }
    } finally {
      setIsLoading(false)
    }
    if (recovery) {
      setFormAlert({ type: 'success', text: 'Si existe una cuenta con este correo, recibirás un enlace para cambiar tu contraseña.' })
    }
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
              <h2 className="sh-form-title mt-3">{recovery ? 'Recupera tu contraseña' : 'Bienvenido a tu mesa'}</h2>
              <p className="text-body-secondary small">
                {recovery ? 'Ingresa el correo que usaste para registrarte.' : 'Ingresa con tu correo y contraseña para abrir tu plan culinario.'}
              </p>

              <form
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

                {!recovery && <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="password"
                      className="form-label sh-label mb-1"
                    >
                      Contraseña
                    </label>
                    <button
                      type="button"
                      className="btn btn-link sh-link small text-decoration-none p-0"
                      disabled={isLoading}
                      onClick={toggleRecovery}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
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
                      Ingresa tu contraseña.
                    </div>
                  </div>
                </div>}

                {formAlert && (
                  <div
                    className={`alert alert-${formAlert.type} py-2 small`}
                    role={formAlert.type === 'danger' ? 'alert' : 'status'}
                  >
                    {formAlert.text}
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
                    {isLoading ? 'Procesando…' : recovery ? 'Enviar enlace' : 'Ingresar a mi plan culinario'}
                  </span>
                  <i
                    className={`bi bi-arrow-right ms-2 btn-arrow${isLoading ? ' d-none' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {recovery && (
                  <button type="button" className="btn btn-link sh-link w-100 mt-2" disabled={isLoading} onClick={toggleRecovery}>
                    Volver a iniciar sesión
                  </button>
                )}
              </form>

              <div className="sh-register mt-4 text-center">
                <strong className="d-block small">
                  ¿Aún no configuras tu perfil de salud?
                </strong>
                <p className="small text-body-secondary mb-3">
                  Crea tu cuenta gratis para calibrar tus alergias,
                  restricciones clínicas y presupuestos culinarios.
                </p>
                <Link to="/registrarse" className="btn sh-btn-outline w-100">
                  <i className="bi bi-sliders me-2" aria-hidden="true" />
                  Crear cuenta y calibrar mis gustos
                </Link>
              </div>
            </div>

            <div className="sh-trust d-flex align-items-start gap-3 mt-4 pt-3">
              <span className="sh-trust-icon">
                <i className="bi bi-shield-fill-check" />
              </span>
              <p className="small text-body-secondary mb-0">
                Confirma tu correo para activar una cuenta nueva.
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

    </div>
  )
}
