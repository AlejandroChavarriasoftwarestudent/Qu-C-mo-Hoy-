import { acceptInvite, updateUser } from '@netlify/identity'
import { useState } from 'react'

export default function NuevaContrasena({ callback, onComplete }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (isLoading) return
    const fields = new FormData(event.currentTarget)
    const password = fields.get('password')
    if (password !== fields.get('confirmation')) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const user = callback.type === 'invite'
        ? await acceptInvite(callback.token, password)
        : await updateUser({ password })
      onComplete(user)
    } catch {
      setError('No se pudo guardar la contraseña. Revisa los requisitos o solicita un enlace nuevo si el actual caducó.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <form className="col-md-6 col-lg-5" onSubmit={handleSubmit}>
          <h1 className="h3 mb-4">{callback.type === 'invite' ? 'Activa tu cuenta' : 'Cambia tu contraseña'}</h1>
          <label className="form-label" htmlFor="new-password">Nueva contraseña</label>
          <input className="form-control" id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} aria-describedby="password-help" required />
          <p className="form-text" id="password-help">Usa al menos 8 caracteres.</p>
          <label className="form-label" htmlFor="confirm-new-password">Confirma la contraseña</label>
          <input className="form-control mb-3" id="confirm-new-password" name="confirmation" type="password" autoComplete="new-password" required />
          {error && <p className="alert alert-danger" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </main>
  )
}
