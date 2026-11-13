import { useEffect } from 'react'

// Ventana emergente simple con las clases de Bootstrap (no necesita librerías extra).
// Si le pasas "alEnviar", el contenido es un <form>.
export default function Modal({ abierto, idTitulo, titulo, alCerrar, alEnviar, children }) {
  useEffect(() => {
    if (!abierto) return undefined
    const alTeclear = (e) => e.key === 'Escape' && alCerrar()
    document.addEventListener('keydown', alTeclear)
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = antes
    }
  }, [abierto, alCerrar])

  if (!abierto) return null
  const Contenido = alEnviar ? 'form' : 'div'

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onMouseDown={(e) => e.target === e.currentTarget && alCerrar()}
      >
        <div className="modal-dialog modal-dialog-centered">
          <Contenido className="modal-content nd-modal" onSubmit={alEnviar} noValidate={alEnviar ? true : undefined}>
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id={idTitulo}>{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={alCerrar}></button>
            </div>
            {children}
          </Contenido>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}
