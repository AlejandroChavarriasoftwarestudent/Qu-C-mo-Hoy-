import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/asistente-react.css'

// ---------- Datos (antes estaban repetidos a mano en el HTML) ----------
const chipsTiempo = [
    { texto: 'Ultra rápido (< 15 min)', min: 0, max: 14, valor: 12 },
    { texto: 'Estándar (20–30 min)', min: 20, max: 30, valor: 25 },
    { texto: 'Sin prisa (+45 min)', min: 45, max: 999, valor: 50 },
]

// El presupuesto se maneja en miles de pesos: 10 = $10.000
const chipsPresupuesto = [
    { texto: 'Súper económico (< $5.000)', min: 0, max: 4.99, valor: 4 },
    { texto: 'Equilibrado ($5.000 – $10.000)', min: 5, max: 10, valor: 8 },
    { texto: 'Gourmet / Gustito ($10.000+)', min: 10.5, max: 99, valor: 15 },
]

const antojos = [
    { icono: 'bi-cup-hot', nombre: 'Salado y caliente', detalle: 'Favorito hoy', columna: 'col-6' },
    { icono: 'bi-flower2', nombre: 'Fresco y ligero', detalle: 'Ensaladas, bowls', columna: 'col-6' },
    { icono: 'bi-grid-3x3-gap', nombre: 'Crujiente y picante', detalle: 'Tostadas, ramen', columna: 'col-6' },
    { icono: 'bi-cake2', nombre: 'Dulce y energético', detalle: 'Avena, frutas, postres', columna: 'col-6' },
    { icono: 'bi-fire', nombre: 'Sabores intensos', detalle: 'Curry, hierbas aromáticas', columna: 'col-12' },
]

const porciones = ['Almuerzo completo', 'Almuerzo ligero', 'Snack sustancioso']

const recetas = {
    'Salado y caliente': ['Crema de calabacín con huevo pochado', 'Cremosa, tibia y lista con lo que ya tienes en tu despensa.'],
    'Fresco y ligero': ['Bowl Mediterráneo', 'Tomate fresco, pepino, aceitunas y garbanzos sobre quinua.'],
    'Crujiente y picante': ['Tacos saludables de pollo', 'Pechuga crocante, lechuga, guacamole y yogur griego.'],
    'Dulce y energético': ['Avena cremosa con frutas', 'Avena con banano, fresas y un toque de canela.'],
    'Sabores intensos': ['Curry suave de garbanzos', 'Hierbas aromáticas y un toque picante con arroz.'],
}

const pesos = (miles) => '$' + (miles * 1000).toLocaleString('es-CO')
const relleno = (valor, min, max) => ({ '--relleno': ((valor - min) * 100) / (max - min) + '%' })

// ---------- Componente de una fila con interruptor ----------
function FilaIngrediente({ color, encendido, alCambiar, titulo, detalle, etiqueta }) {
    return (
        <div className={'fila-ingrediente ' + color + (encendido ? ' encendida' : '')}>
            <span className="casilla"><i className="bi bi-check"></i></span>
            <div className="flex-grow-1">
                <b>{titulo}</b> {etiqueta}
                <br />
                <small>{detalle}</small>
            </div>
            <label className="interruptor">
                <input type="checkbox" checked={encendido} onChange={(e) => alCambiar(e.target.checked)} />
                <span className="pista"></span>
            </label>
        </div>
    )
}

export default function Asistente() {
    // ---------- Estado (antes eran variables y classList en asistente.js) ----------
    const [tiempo, setTiempo] = useState(25)
    const [presupuesto, setPresupuesto] = useState(10)
    const [antojo, setAntojo] = useState(0)
    const [porcion, setPorcion] = useState(0)
    const [caducar, setCaducar] = useState(true)
    const [soloTengo, setSoloTengo] = useState(true)
    const [ahorro, setAhorro] = useState(true)
    const [vista, setVista] = useState('Hoy')
    const [resultado, setResultado] = useState(null)
    const presupuestoAnterior = useRef(10)

    // ---------- Valores calculados ----------
    const dentroDelPlan = presupuesto <= 15
    const afinidad = Math.max(80, Math.min(99, Math.round(99 - Math.abs(tiempo - 25) / 5 - Math.abs(presupuesto - 10) / 3)))

    // ---------- Acciones ----------
    function cambiarAhorro(activo) {
        setAhorro(activo)
        if (activo) {
            presupuestoAnterior.current = presupuesto
            setPresupuesto(4)
        } else {
            setPresupuesto(presupuestoAnterior.current)
        }
    }

    function limpiarFiltros() {
        setTiempo(25)
        setPresupuesto(10)
        setAntojo(0)
        setPorcion(0)
        setCaducar(true)
        setSoloTengo(true)
        setAhorro(true)
        presupuestoAnterior.current = 10
    }

    function decidir(t = tiempo, p = presupuesto, a = antojo, por = porcion) {
        const receta = recetas[antojos[a].nombre]
        setResultado({
            titulo: receta[0],
            descripcion: receta[1],
            resumen: `⏱ Hasta ${t} min · 💲 Hasta ${pesos(p)} · 🍽 ${porciones[por]}`,
        })
    }

    function sorprender() {
        const t = 10 + 5 * Math.floor(Math.random() * 11)
        const p = 3 + 0.5 * Math.floor(Math.random() * 45)
        const a = Math.floor(Math.random() * antojos.length)
        const por = Math.floor(Math.random() * porciones.length)
        setTiempo(t)
        setPresupuesto(p)
        setAntojo(a)
        setPorcion(por)
        decidir(t, p, a, por)
    }

    return (
        <div className="pagina-asistente">
            {/* ================= MENÚ LATERAL ================= */}
            <aside className="menu-lateral">
                <Link to="/descubrir" className="logo">
                    <i className="bi bi-cup-hot-fill"></i>
                    <div>
                        <b>NutriDecide</b>
                        <small>Plan Consciente</small>
                    </div>
                </Link>
                <div className="tarjeta-usuario">
                    <div className="avatar"></div>
                    <div>
                        <b>Luna</b>
                        <br />
                        <small className="text-success">● Saludable </small>
                    </div>
                </div>
                <Link to="/descubrir" className="enlace-menu">
                    <i className="bi bi-compass"></i>
                    Descubrir
                </Link>
                <Link to="/asistente" className="enlace-menu activo">
                    <i className="bi bi-stars"></i>
                    Asistente Inteligente
                </Link>
                <Link to="/perfil-clinico" className="enlace-menu">
                    <i className="bi bi-shield-plus"></i>
                    Mis Dietas y Salud
                </Link>
                <Link to="/presupuesto" className="enlace-menu">
                    <i className="bi bi-wallet2"></i>
                    Mi Presupuesto
                </Link>
                <Link to="/favoritos" className="enlace-menu">
                    <i className="bi bi-bookmark"></i>
                    Favoritos e Historial
                </Link>
                <div className="parte-baja">
                    <button type="button" className="boton-sorpresa-menu" onClick={sorprender}>
                        <i className="bi bi-stars"></i>
                        Sorpréndeme
                    </button>
                    <Link to="/configuracion" className="enlace-menu">
                        <i className="bi bi-gear"></i>
                        Ajustes
                    </Link>
                    <Link to="/" className="enlace-menu">
                        <i className="bi bi-box-arrow-right"></i>
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* ================= CONTENIDO ================= */}
            <main className="contenido-asistente">
                {/* Barra superior */}
                <header className="barra-arriba">
                    <div className="buscador">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Buscar recetas, ingredientes..." />
                    </div>
                    <div className="enlaces-tiempo">
                        {['Hoy', 'Semanal', 'Despensa'].map((nombre) => (
                            <a
                                key={nombre}
                                href="#"
                                className={vista === nombre ? 'activo' : ''}
                                onClick={(e) => { e.preventDefault(); setVista(nombre) }}
                            >
                                {nombre}
                            </a>
                        ))}
                    </div>
                    <div className="pildora-presupuesto">
                        <i className="bi bi-cash-stack"></i>
                        Presupuesto: <b>$25.000</b>
                    </div>
                    <i className="bi bi-bell campana"></i>
                    <i className="bi bi-heart"></i>
                    <button type="button" className="boton-rojo" onClick={sorprender}>
                        <i className="bi bi-stars"></i>
                        Sorpréndeme
                    </button>
                </header>

                {/* Encabezado */}
                <section className="encabezado">
                    <div>
                        <span className="etiqueta-rosa">MODO INTELIGENTE</span>
                        <small className="ms-2">
                            <i className="bi bi-lightning-charge-fill texto-vino"></i> 30 segundos para resolver tu plato
                        </small>
                        <h1>Asistente de Decisión</h1>
                        <p className="text-muted">Resuelve tu dilema de comida en 30 segundos ajustando tus necesidades.</p>
                    </div>
                    <div className="tarjeta-ingredientes">
                        <span className="circulo-verde"><i className="bi bi-check-lg"></i></span>
                        <div>
                            <b>8 ingredientes disponibles</b>
                            <br />
                            <small className="text-success">Libre de harinas activado</small>
                        </div>
                    </div>
                </section>

                <div className="row g-3">
                    {/* ===== TARJETA 1: TIEMPO ===== */}
                    <div className="col-lg-6">
                        <div className="tarjeta">
                            <div className="tarjeta-cabecera">
                                <div className="d-flex gap-2">
                                    <span className="icono-tarjeta"><i className="bi bi-clock"></i></span>
                                    <div>
                                        <h6>¿Cuánto tiempo tienes para cocinar hoy?</h6>
                                        <small className="text-muted">Ajusta el tiempo límite exacto de preparación</small>
                                    </div>
                                </div>
                                <div className="valor-caja">
                                    <b>{tiempo}</b>
                                    <small>min</small>
                                </div>
                            </div>
                            <input
                                type="range"
                                className="deslizador"
                                min="10" max="60" step="5"
                                value={tiempo}
                                style={relleno(tiempo, 10, 60)}
                                onChange={(e) => setTiempo(+e.target.value)}
                            />
                            <div className="escala">
                                <span>10 min</span>
                                <span className="marca">25 min</span>
                                <span>40 min</span>
                                <span>60 min</span>
                            </div>
                            <p className="etiqueta-seccion">AJUSTES RÁPIDOS</p>
                            <div className="grupo-chips">
                                {chipsTiempo.map((c) => (
                                    <button
                                        key={c.texto}
                                        type="button"
                                        className={'chip ' + (tiempo >= c.min && tiempo <= c.max ? 'activo' : '')}
                                        onClick={() => setTiempo(c.valor)}
                                    >
                                        {c.texto}
                                    </button>
                                ))}
                            </div>
                            <p className="nota"><i className="bi bi-droplet-fill text-success"></i> Ideal para cocinar rico en poco tiempo</p>
                        </div>
                    </div>

                    {/* ===== TARJETA 2: PRESUPUESTO ===== */}
                    <div className="col-lg-6">
                        <div className="tarjeta">
                            <div className="tarjeta-cabecera">
                                <div className="d-flex gap-2">
                                    <span className="icono-tarjeta"><i className="bi bi-cash-stack"></i></span>
                                    <div>
                                        <h6>¿Cuál es tu presupuesto para esta comida?</h6>
                                        <small className="text-muted">Estimación de costo por porción</small>
                                    </div>
                                </div>
                                <div className="valor-caja valor-rosa">
                                    <b>{pesos(presupuesto)}</b>
                                </div>
                            </div>
                            <input
                                type="range"
                                className="deslizador"
                                min="3" max="25" step="0.5"
                                value={presupuesto}
                                style={relleno(presupuesto, 3, 25)}
                                onChange={(e) => setPresupuesto(+e.target.value)}
                            />
                            <div className="escala">
                                <span>$3.000</span>
                                <span className="marca">$10.000</span>
                                <span>$15.000</span>
                                <span>$25.000</span>
                            </div>
                            <p className="etiqueta-seccion">RANGO PRESUPUESTARIO</p>
                            <div className="grupo-chips">
                                {chipsPresupuesto.map((c) => (
                                    <button
                                        key={c.texto}
                                        type="button"
                                        className={'chip chip-cafe ' + (presupuesto >= c.min && presupuesto <= c.max ? 'activo' : '')}
                                        onClick={() => setPresupuesto(c.valor)}
                                    >
                                        {c.texto}
                                    </button>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <small>Presupuesto restante hoy: <b>$15.000</b></small>
                                <span
                                    className="etiqueta-verde"
                                    style={dentroDelPlan ? {} : { background: '#fde3e8', color: '#b5174b' }}
                                >
                                    {dentroDelPlan ? 'Dentro del plan' : 'Sobre tu presupuesto'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ===== TARJETA 3: ANTOJO ===== */}
                    <div className="col-lg-6">
                        <div className="tarjeta">
                            <div className="d-flex gap-2 mb-3">
                                <span className="icono-tarjeta"><i className="bi bi-heart"></i></span>
                                <div>
                                    <h6>¿Qué antojo buscas?</h6>
                                    <small className="text-muted">Conecta tu apetito actual con la propuesta perfecta</small>
                                </div>
                            </div>
                            <div className="row g-2">
                                {antojos.map((a, i) => (
                                    <div key={a.nombre} className={a.columna}>
                                        <button
                                            type="button"
                                            className={'opcion-antojo ' + (antojo === i ? 'activo' : '')}
                                            onClick={() => setAntojo(i)}
                                        >
                                            <i className={'bi ' + a.icono}></i>
                                            <div>
                                                <b>{a.nombre}</b>
                                                <small>{a.detalle}</small>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="etiqueta-seccion mt-3">TIPO DE PORCIÓN</p>
                            <div className="grupo-chips">
                                {porciones.map((p, i) => (
                                    <button
                                        key={p}
                                        type="button"
                                        className={'opcion-porcion ' + (porcion === i ? 'activo' : '')}
                                        onClick={() => setPorcion(i)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== TARJETA 4: INGREDIENTES ===== */}
                    <div className="col-lg-6">
                        <div className="tarjeta">
                            <div className="d-flex gap-2 mb-3">
                                <span className="icono-tarjeta icono-verde"><i className="bi bi-basket"></i></span>
                                <div>
                                    <h6>Ingredientes clave y despensa</h6>
                                    <small className="text-muted">Priorización inteligente contra el desperdicio</small>
                                </div>
                            </div>
                            <FilaIngrediente
                                color="verde"
                                encendido={caducar}
                                alCambiar={setCaducar}
                                titulo="Usar ingredientes por caducar primero"
                                etiqueta={
                                    <span className={'etiqueta-activo' + (caducar ? '' : ' apagado')}>
                                        {caducar ? 'ACTIVO' : 'INACTIVO'}
                                    </span>
                                }
                                detalle={
                                    <>
                                        Priorizando: <span className="texto-verde">Lechuga Fresca (2 días)</span>,{' '}
                                        <span className="texto-verde">Huevos (3 días)</span>
                                    </>
                                }
                            />
                            <FilaIngrediente
                                color="rojo"
                                encendido={soloTengo}
                                alCambiar={setSoloTengo}
                                titulo="Solo ingredientes que ya tengo"
                                detalle="Cero compras extras."
                            />
                            <FilaIngrediente
                                color="cafe"
                                encendido={ahorro}
                                alCambiar={cambiarAhorro}
                                titulo="Modo Ahorro Máximo"
                                detalle="Baja tu presupuesto a lo mínimo posible"
                            />
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <small><i className="bi bi-shield-check text-success"></i> Filtro de alergias bloqueado y seguro</small>
                                <Link to="/perfil-clinico" className="texto-vino"><small>Editar</small></Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= BARRA DE DECISIÓN ================= */}
                <div className="barra-decision">
                    <span className="icono-algoritmo"><i className="bi bi-sliders"></i></span>
                    <div className="flex-grow-1">
                        <b>Algoritmo listo</b>
                        <span className="etiqueta-verde"><span>{afinidad}</span>% de afinidad</span>
                        <br />
                        <small className="text-muted">3 opciones altamente compatibles detectadas con tus 8 ingredientes</small>
                    </div>
                    <button type="button" className="boton-limpiar" onClick={limpiarFiltros}>
                        <i className="bi bi-arrow-repeat"></i>
                        Limpiar filtros
                    </button>
                    <button type="button" className="boton-decidir" onClick={() => decidir()}>
                        <i className="bi bi-magic"></i>
                        ¡Decidir mi Comida Ahora!
                    </button>
                </div>
            </main>

            {/* ================= VENTANA DE RESULTADO ================= */}
            {resultado && (
                <div className="fondo-modal" onClick={() => setResultado(null)}>
                    <div className="ventana-resultado" onClick={(e) => e.stopPropagation()}>
                        <span className="etiqueta-rosa">TU DECISIÓN</span>
                        <h4 className="mt-3">{resultado.titulo}</h4>
                        <p className="text-muted">{resultado.descripcion}</p>
                        <p className="resumen">{resultado.resumen}</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Link to="/descubrir" className="boton-limpiar text-decoration-none">Ver más recetas</Link>
                            <button type="button" className="boton-decidir" onClick={() => setResultado(null)}>¡Perfecto!</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
