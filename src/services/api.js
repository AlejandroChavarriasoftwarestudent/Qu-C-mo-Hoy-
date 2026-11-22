const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '')

function leer(clave) {
  try { return localStorage.getItem(clave) ?? sessionStorage.getItem(clave) } catch { return null }
}

export const obtenerToken = () => leer('token')

export function obtenerUsuario() {
  if (!leer('token')) return null
  try { return JSON.parse(leer('usuario')) } catch { return null }
}

function limpiar() {
  for (const a of [localStorage, sessionStorage]) {
    a.removeItem('token')
    a.removeItem('usuario')
  }
}

export function guardarSesion(token, usuario, recordar = true) {
  limpiar()
  const almacen = recordar ? localStorage : sessionStorage
  almacen.setItem('token', token)
  almacen.setItem('usuario', JSON.stringify(usuario))
  window.dispatchEvent(new Event('sesion'))
}

export function cerrarSesion() {
  limpiar()
  window.dispatchEvent(new Event('sesion'))
}

async function peticion(ruta, opciones = {}) {
  const token = obtenerToken()
  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Si es la primera vez, espera un minuto y reintenta.')
  }
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) throw new Error(datos.mensaje || 'Error del servidor')
  return datos
}

export const iniciarSesion = (identificador, password) =>
  peticion('/api/usuarios/login', { method: 'POST', body: JSON.stringify({ identificador, password }) })

export const registrarUsuario = (datos) =>
  peticion('/api/usuarios/registro', { method: 'POST', body: JSON.stringify(datos) })