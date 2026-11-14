const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const SESSION_KEY = 'QueComoHoy:session'

export function getSession() {
  const rawSession =
    localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  return rawSession ? JSON.parse(rawSession) : null
}

export function getToken() {
  return getSession()?.token
    ?? localStorage.getItem('token')
    ?? sessionStorage.getItem('token')
    ?? null
}

export function getCurrentUser() {
  return getSession()?.usuario ?? null
}

export function saveSession(data, remember = true) {
  const session = JSON.stringify({
    token: data.token,
    usuario: data.usuario,
  })

  clearSession()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(SESSION_KEY, session)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

export async function apiFetch(ruta, opciones = {}) {
  const headers = new Headers(opciones.headers)
  if (opciones.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  })
  const texto = await respuesta.text()
  let datos = {}

  if (texto) {
    try {
      datos = JSON.parse(texto)
    } catch {
      throw new Error('El servidor devolvió una respuesta no válida.')
    }
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401) clearSession()
    throw new Error(datos.mensaje || `Error de solicitud (${respuesta.status})`)
  }

  return datos
}
