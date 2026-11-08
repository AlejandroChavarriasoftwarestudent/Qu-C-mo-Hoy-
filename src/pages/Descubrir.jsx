import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/descubrir-react.css'

const recetasSorpresa = ['Bowl Mediterráneo', 'Tacos saludables de pollo', 'Pasta cremosa de tomate']

export default function Descubrir() {
    // Estado: cuál antojo está seleccionado (antes lo hacía app.js con classList)
    const [antojo, setAntojo] = useState(1)

    function sorprender(e) {
        e.preventDefault()
        const numero = Math.floor(Math.random() * recetasSorpresa.length)
        alert('🎲 Hoy te toca: ' + recetasSorpresa[numero])
    }

    return (
        <div className="pagina-descubrir">
    <div className="menu">
            <Link to="/descubrir" className="logo">
                <i className="bi bi-cup-hot-fill"></i>
                <div>
                    <b>NutriDecide</b>
                    <small>Plan Consciente</small>
                </div>
            </Link>
            <Link to="/descubrir" className="enlace-menu activo">
                <i className="bi bi-compass-fill"></i>
                Descubrir
            </Link>
            <Link to="/asistente" className="enlace-menu">
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
        </div>
    <main className="contenido">
        <div className="barra-superior">
                <div className="saludo">
                    <h6>¡Hola, Luna! 👋</h6>
                    <small>¿Qué te apetece comer hoy sin complicaciones?</small>
                </div>
                <div className="buscador">
                    <i className="bi bi-search"></i>
                    <input className="form-control" placeholder="Buscar por ingrediente, receta o ..." />
                </div>
                <div className="presupuesto">
                    <span className="cartera">
                        <i className="bi bi-wallet2"></i>
                    </span>
                    <div className="flex-grow-1">
                        <b>Presupuesto</b>
                        &nbsp;
                        <b>$10.000</b> / 25.000
                        <div className="progreso">
                            <i></i>
                        </div>
                    </div>
                </div>
                <i className="bi bi-bell campana fs-5"></i>
                <i className="bi bi-heart fs-5"></i>
            </div>

        <section className="bienvenida mb-4">
            <div className="row align-items-center">
                    <div className="col-md-9">
                        <span className="etiqueta-roja">
                            <i className="bi bi-lightning-charge-fill"></i>

                            Recomendación instantánea 

                        </span>

                        <span className="etiqueta-verde bg-white">
                            <i className="bi bi-check-circle"></i>
                            Adaptado a tu economía

                        </span>

                        <h2>¿No sabes qué cocinar?
                            Resolvemos tu almuerzo
                        </h2>

                        <p className="text-muted mb-2">Basado en ingredientes que tienes a la mano</p>

                        <small className="me-2">Filtro ágil</small>

                        <span className="filtro">
                            <i className="bi bi-stopwatch"></i> Menos de 20 minutos
                        </span>

                        <span className="filtro">
                            <i className="bi bi-piggy-bank"></i>
                            Económico &lt; $20.000
                        </span>

                        <span className="filtro">
                            <i className="bi bi-flower1"></i> Bajo en carbohidratos
                        </span>

                    </div>

                    <div className="col-md-3 text-center mt-3 mt-md-0">
                        <a href="#" onClick={(e) => e.preventDefault()} className="btn boton-principal" onClick={sorprender}>
                            <i className="bi bi-dice-5-fill"></i> ¡Sorpréndeme!
                            <i className="bi bi-arrow-right"></i>
                        </a>

                        <div className="small mt-2">
                            <Link to="/presupuesto" className="text-decoration-none text-dark"> Ó
                                <u className="texto-morado">armar menú aleatorio semanal</u></Link>
                        </div>

                    </div>

            </div>
        </section>

        <div className="row g-3">
            <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="titulo-seccion">
                        <i className="bi bi-brightness-high"></i>
                        Inspiración del día

                        <span className="etiqueta-roja">Selección Para Hoy</span>

                    </span>

                    <Link to="/favoritos" className="small text-decoration-none fw-semibold texto-morado"> Ver más sugerencias</Link>

                </div>

                <div  className="row g-3">
                    <div className="col-md-4">
                        <div className="tarjeta-receta">
                            <div className="imagen-receta">
                                <img src="/imagenes/bowl-mediterraneo.jpeg" alt="Bowl Mediterráneo" />
                                <span className="etiqueta-verde">
                                    <i className="bi bi-check-circle"></i>
                                    Con verduras
                                </span>

                                <span className="porcentaje">
                                     98%

                                    <br />

                                    Match

                                </span>

                                <div className="informacion-receta">
                                    <span>
                                        <i className="bi bi-clock"></i>
                                        15 minutos
                                    </span>

                                    <span>
                                         $12.000 · 480 kcal
                                    </span>

                                </div>

                            </div>

                            <div className="contenido-receta">
                                <h6 className="text-truncate"> Bowl Mediterráneo</h6>
                                <p> combinación de tomates frescos, aceitunas, pepino y cebolla morada sobre quinua, complementado con garbanzos y queso parmesano.</p>

                                <div className="d-flex justify-content-between
                                    align-items-center mt-2">

                                    <div className="despensa">
                                        <i className="bi bi-journal-text"></i>

                                        Despensa:
                                        <br />
                                        3/5
                                     </div>

                                     <Link to="/asistente" className="btn boton-secundario px-4"> Ver detalles</Link>


                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="col-md-4">
                        <div className="tarjeta-receta">
                            <div className="imagen-receta">
                                <img src="/imagenes/Tacos-saludables.jfif" alt="Tacos Saludables" />
                                <span className="etiqueta-verde">
                                    <i className="bi bi-check-circle"></i>
                                    Con proteina

                                </span>
                                <span className="porcentaje">
                                     95%

                                    <br />

                                    Match

                                </span>
                                <div className="informacion-receta">
                                    <span>
                                        <i className="bi bi-clock"></i>
                                        20 minutos
                                    </span>

                                    <span>
                                         $10.000 · 515 kcal
                                    </span>

                                </div>
                            </div>

                            <div className="contenido-receta">
                                <h6 className="text-truncate"> Tacos saludables de pollo</h6>
                                <p>Tacos de pechuga crocante, lechuga, guacamole y aderezo de yogur griego.</p>

                                <div className="d-flex justify-content-between
                                    align-items-center mt-2">

                                    <div className="despensa"> 
                                        <i className="bi bi-journal-text"></i>
                                        Despensa:
                                        <br />
                                        4/5

                                    </div>

                                    <Link to="/asistente" className="btn boton-secundario px-4">
                                        Ver detalles

                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div  className="col-md-4">
                        <div className="tarjeta-receta">
                            <div className="imagen-receta">
                                <img src="/imagenes/Pasta-cremosa.jfif" alt="Pasta cremosa de tomate" />
                                <span className="etiqueta-verde">
                                    <i className="bi bi-check-circle"></i>
                                    Carbohidrato

                                </span>
                                <span className="porcentaje">
                                    92%

                                    <br />

                                    Match


                                </span>

                                <div className="informacion-receta">
                                    <span>
                                        <i className="bi bi-clock"></i>
                                        20 minutos
                                    </span>
                                    <span>
                                         $8.000 · 550 kcal
                                    </span>

                                </div>

                            </div>

                            <div className="contenido-receta">
                                <h6 className="text-truncate"> Pasta cremosa de tomate</h6>
                                <p>Tornillos de pasta y cubos de pechuga de pollo integrados con crema de tomate casera con hierbas.</p>

                                <div className="d-flex justify-content-between
                                    align-items-center mt-2">
                                    <div className="despensa">
                                        <i className="bi bi-journal-text"></i>
                                        Despensa:
                                        <br />
                                        5/5

                                    </div>
                                    <Link to="/asistente" className="btn boton-secundario px-4">
                                        Ver detalles

                                    </Link>

                                </div>
                            </div>

                        </div>
                    </div>


                </div>




            </div>

            <div className="col-lg-4">
                <div className="panel">
                    <div className="d-flex justify-content-between">
                        <h6>
                            <i className="bi bi-emoji-smile"></i>
                            ¿Cuál es tu antojo?
                        </h6>


                    </div>
                    <p className="small text-muted mb-2"> Filtra por textura o sabor:</p>
                    <div className="row g-2">
                        <div className="col-6">
                            <div className={"antojo" + (antojo === 0 ? " seleccionado" : "")} onClick={() => setAntojo(0)}>
                                <i className="bi bi-grid-3x3-gap"></i>
                                <div>
                                     Crujiente

                                    <br />

                                    <small>

                                        2 recetas

                                    </small>
                                </div>


                            </div>

                        </div>

                        <div className="col-6">
                            <div className={"antojo" + (antojo === 1 ? " seleccionado" : "")} onClick={() => setAntojo(1)}>
                                 <i className="bi bi-cup-hot"></i>


                                <div>


                                    <span className="texto-morado">

                                        Salado

                                    </span>


                                    <br />


                                    <small className="texto-morado">

                                        3 recetas

                                    </small>


                                </div>


                            </div>

                        </div>

                        <div className="col-6">
                            <div className={"antojo" + (antojo === 2 ? " seleccionado" : "")} onClick={() => setAntojo(2)}>
                                <i className="bi bi-cake2"></i>
                                <div>
                                    Dulce
                                    <br />
                                    <small> 3 opciones</small>
                                </div>

                            </div>

                        </div>

                        <div className="col-6">
                        <div className={"antojo" + (antojo === 3 ? " seleccionado" : "")} onClick={() => setAntojo(3)}>
                            <i className="bi bi-flower2 icono-verde"></i>
                            <div>
                                Ligero y Saludable
                                <br />
                                <small>
                                    2 bowls
                                </small>
                            </div>

                        </div>
                        </div>

                    </div>

                </div>

            <div className="panel">
                <h6 className="small">
                    <i  className="bi bi-robot icono-morado"></i>
                    Asistente Express

                </h6>
                <div className="mensaje-asistente mb-2">
                     Te sobran <b>Papas</b> y
                        <b>Salchicha</b>.
                        ¿Te sugiero unas Salchipapas con huevo tibio en
                        15 min por solo $6.000?

                </div>
                <div className="d-flex gap-2">
                    <Link to="/asistente" className="btn boton-verde flex-grow-1">¡Sí, prepárala!</Link>
                    <a href="#" onClick={(e) => e.preventDefault()} className="btn boton-secundario">Otra idea</a>

                </div>
            </div>
            </div>
        </div>
</main>

  
        </div>
    )
}
