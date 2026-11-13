import { useCallback, useEffect, useRef, useState } from 'react'

// Aviso emergente (igual que el "notify" de perfilClinico). Uso: const [aviso, avisar] = useAviso()
// Pon {aviso} una vez en tu página y llama avisar('texto') donde quieras.
export default function useAviso() {
  const [mensaje, setMensaje] = useState('')
  const temporizador = useRef(null)

  useEffect(() => () => window.clearTimeout(temporizador.current), [])

  const avisar = useCallback((texto) => {
    setMensaje(texto)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => setMensaje(''), 2800)
  }, [])

  const aviso = mensaje ? (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className="toast nd-toast show align-items-center" role="status" aria-live="polite">
        <div className="d-flex">
          <div className="toast-body">{mensaje}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar" onClick={() => setMensaje('')}></button>
        </div>
      </div>
    </div>
  ) : null

  return [aviso, avisar]
}
