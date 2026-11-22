import { logout } from '@netlify/identity'
import { useState } from 'react'

export default function CerrarSesion({ className = '', children = 'Cerrar sesión' }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setIsLoading(true)
    setError('')
    try {
      await logout()
    } catch {
      setError('No se pudo cerrar sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button className={`${className} w-100 border-0 text-start`} type="button" onClick={handleClick} disabled={isLoading}>
        <i className="bi bi-box-arrow-right" aria-hidden="true" /> {isLoading ? 'Cerrando sesión…' : children}
      </button>
      {error && <p className="text-danger small px-3 mb-0" role="alert">{error}</p>}
    </>
  )
}
