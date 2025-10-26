import $ from 'jquery';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { auth, db } from './firebase/init.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, onSnapshot, collection, query, where, writeBatch, serverTimestamp, limit } from "firebase/firestore";

import { Capi, Mensaje, Notificacion, savels, getls, removels, accederRol, gosaves, getsaves, adrm, adtm, infoo, mis10} from './widev.js';

// 🔐 GESTIÓN DE AUTENTICACIÓN EN DASHBOARD
let userAuth = null; //Para guardar usuario

onAuthStateChanged(auth, async user => {
  if(!user) return window.location.href = '/'; // Seguridad default 
  userAuth = user; //Guardando usuario

  try{
    const wi = getls('wiSmile');
    if(wi) return smileContenido(wi); // Cache primero 

    const busq = await getDocs(query(collection(db, 'smiles'), where('usuario', '==', user.displayName)));
    const widt = busq.docs[0].data(); savels('wiSmile', widt, 450); smileContenido(widt); // Desde Online 
  }catch(e){console.error(e)}
});

$(document).on('click', '.bt_salir', async () => {
  await signOut(auth); window.location.href = '/';   // Cierra la sesión + Envia al inicio 
  try{localStorage.clear();}catch(_){Object.keys(localStorage).forEach(k=>localStorage.removeItem(k));} //Limpieza de localStorage
});

$(document).on('click','.tab-btn', function(){
    const activetb = $(this).data('tab');
    adrm(this, 'active'); adrm('#'+activetb+'-tab', 'active');

});

// En el evento click '.bt_cargar' (línea 30), ACTUALIZAR:
$(document).on('click','.bt_cargar',()=>{
  const pattern=/^(im\d+|ki\d+|remote:im\d+|dirty:im\d+|dirty:ki\d+|toursSmile|notasSmile)$/;
  Object.keys(localStorage).filter(k=>pattern.test(k)).forEach(k=>localStorage.removeItem(k));
  Mensaje('Actualizado'); setTimeout(()=>location.reload(),800);
});
// ...existing code...

// VARIABLES GLOBALES
let currentMonth = '2025-09';
let currentPage = 1;
let ventasPorPagina = 5;
let todasLasVentas = [];
let todosLosEmpleados = [];

// DIOS SIEMPRE ES BUENO Y YO AMO A DIOS [START]
function smileContenido(wi){
    console.log(wi.nombre); 
    Mensaje('Bienvenido ' + wi.nombre + '!');

    // HTML CONTENIDO [Start] 
    $('.app').html(`
        <!-- HEADER SUPERIOR -->
        <header class="top-header">
            <div class="header-container miwp">
                <div class="header-left">
                    <h1 class="main-title">
                        <i class="fas fa-trophy"></i>
                        RETO DEL MES
                    </h1>
                    <select id="monthSelector" class="month-selector">
                        <option value="2025-09">Septiembre 2025</option>
                        <option value="2025-10">Octubre 2025</option>
                        <option value="2025-11">Noviembre 2025</option>
                        <option value="2025-12">Diciembre 2025</option>
                    </select>
                </div>
                <div class="header-right">
                    <div class="wifresh"><i class="fa-solid fa-rotate-right"></i></div>
                    <div class="witemas"></div>
                    <div class="user-section">
                        <div class="user-info">
                            <img src="${wi.imagen || '/smile.png'}" alt="${wi.nombre}" class="user-avatar">
                            <span class="user-name">${wi.nombre}</span>
                        </div>
                        <button class="logout-btn bt_salir">
                            <i class="fas fa-sign-out-alt"></i>
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- CONTENIDO PRINCIPAL -->
        <main class="main-container miwp">
            <div class="dashboard-layout">
                
                <!-- SECCION NUEVA VENTA -->
                <section class="new-sale-panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-plus-circle"></i> Nueva Venta</h2>
                        <div class="bt_add_exportar">
                            <p>Venta por:</p>
                            <label for="vtJulio"><input type="checkbox" id="vtJulio"/>Julio</label>   
                            <label for="vtSonia"><input type="checkbox" id="vtSonia"/>Sonia</label>   
                            <label for="vtExterna"><input type="checkbox" id="vtExterna"/>Otros</label>   
                            <button class="btn-add" id="addNewSale">
                                <i class="fas fa-plus"></i> Agregar
                            </button>
                        </div>
                    </div>

                    ${getFormularioHTML()}
                </section>

                <!-- SECCION COMPETENCIA -->
                <section class="competition-panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-fire"></i> Competencia del Mes</h2>
                        <span class="subtitle">¡Quien venda más gana!</span>
                    </div>

                    <ul class="descripcion_com">
                        <li>¡Buenos días Rubi y Piero! Mi nombre es Wilder Taype, desarrollador de este sitio web. Espero que se encuentren muy bien. Quería agradecerles por registrarse y mantener sus ventas actualizadas. Para hacerles las cosas aún más fáciles, he actualizado la plataforma con mejoras en la búsqueda de tours y otras funcionalidades.</li>
                        <li>Ayer tuvimos una reunión con Clau y, para simplificar el proceso de registro, hemos actualizado 
                        el campo de motivo de viaje para mantener todo al día con SUNAT y trabajar con mayor tranquilidad.</li>
                    </ul>

                    <!-- TRABAJADORES DINÁMICOS -->
                    <div class="workers-grid" id="workersGrid">
                        <div class="loading-workers">
                            <i class="fas fa-spinner fa-spin"></i>
                            Cargando empleados...
                        </div>
                    </div>

                    <!-- ULTIMO GANADOR DEL MES -->
                    <div class="last-winner" id="lastWinner">
                        <div class="loading-workers">
                            <i class="fas fa-spinner fa-spin"></i>
                            Cargando ganador...
                        </div>
                    </div>

                    <!-- RESUMEN COMPETENCIA -->
                    <div class="competition-summary" id="competitionSummary">
                        <div class="summary-stat">
                            <span class="summary-label">Tours de Hoy</span>
                            <span class="summary-value" id="toursHoy">0</span>
                        </div>
                        <div class="summary-stat">
                            <span class="summary-label">Total Tours</span>
                            <span class="summary-value" id="totalTours">0</span>
                        </div>
                        <div class="summary-stat">
                            <span class="summary-label">Puntos Totales</span>
                            <span class="summary-value" id="totalPuntos">0</span>
                        </div>
                        <div class="summary-stat">
                            <span class="summary-label">Meta del Mes</span>
                            <span class="summary-value">2500</span>
                        </div>
                    </div>
                </section>
            </div>

            <!-- TABLA DE VENTAS -->
<section class="sales-table-section">
    <div class="table-header">
        <h2><i class="fas fa-clipboard-list"></i> Registro de Ventas</h2>
        <div class="table-filters">
            <select id="mostrarn" class="filter-select">
                <option value="5">Mostrar 5 ventas</option>
                <option value="7">7 ventas</option>
                <option value="10">10 ventas</option>
                <option value="15">15 ventas</option>
            </select>
            <select id="filterEmployee" class="filter-select">
                <option value="">Todos los vendedores</option>
            </select>
            <button class="filter-btn" id="todayFilter">
                <i class="fas fa-calendar-day"></i> Hoy
            </button>
        </div>
    </div>

    <div class="table-container">
        <table class="sales-table" id="salesTable">
            <thead>
                <tr>
                    <th><i class="fas fa-calendar"></i> Fecha</th>
                    <th><i class="fas fa-user"></i> Usuario</th>
                    <th><i class="fas fa-route"></i> Tipo Tour</th>
                    <th><i class="fas fa-users"></i> PAX</th>
                    <th><i class="fas fa-user-tag"></i> Nombre</th>
                    <th><i class="fas fa-calculator"></i> M. Total</th>
                    <th><i class="fas fa-dollar-sign"></i> M. Individual</th>
                    <th><i class="fas fa-credit-card"></i> Pagado</th>
                    <th><i class="fas fa-hand-holding-usd"></i> Ganancia</th>
                    <th><i class="fas fa-star"></i> Puntos</th>
                    <th><i class="fas fa-cogs"></i> Acciones</th>
                </tr>
            </thead>
            <tbody id="salesTableBody">
                <tr><td colspan="12" class="loading-cell">
                    <i class="fas fa-spinner fa-spin"></i> Cargando ventas...
                </td></tr>
            </tbody>
        </table>
    </div>

    <!-- PAGINACIÓN -->
    <div class="pagination-container" id="paginationContainer">
        <!-- Se llena dinámicamente -->
    </div>
</section>

            ${getInfoTabsHTML()}
        </main>

        <div id="notifications-container"></div>
        <div id="modal-container"></div>

<footer class='foo hwb txc'>
<p>Creado con<i class='wicon wi-corazon'></i>by<a class='ftx lkme' href='https://wtaype.github.io/' target='_blank'>@wilder.taype</a>2025 - <span class='wty'></span><span class='abw tm11042025' id='101542394703517594'>| Acerca del app | Actualizado</span><span class='wtu'></span></p>
</footer>
    `);

    // Inicializar datos
    inicializarDashboard(wi);
}

// AGREGAR función para cargar notas (línea 950)
async function cargarNotas() {
    try {
        console.log('🔄 Cargando notas admin...');
        
        // 🚀 CACHE PRIMERO
        const cache = getls('notasSmile');
        if (cache?.length > 0) {
            console.log(`✅ ${cache.length} notas desde cache`);
            renderizarNotas(cache);
            return;
        }
        
        // 📡 DESDE FIREBASE
        const snapshot = await getDocs(collection(db, 'notas'));
        if (snapshot.empty) {
            console.log('📭 No hay notas');
            renderizarNotas([]);
            return;
        }
        
        const notasData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // 💾 CACHE (10 minutos)
        savels('notasSmile', notasData, 600);
        console.log(`✅ ${notasData.length} notas cargadas`);
        renderizarNotas(notasData);
        
    } catch (error) {
        console.error('❌ Error cargar notas:', error);
        renderizarNotas([]);
    }
}

// REEMPLAZAR función renderizarNotas (línea ~210)
function renderizarNotas(notas) {
    const html = notas.length > 0 ? `
        ${notas.map(nota => `<li>${nota.nota}</li>`).join('')}
        <div style="font-size:var(--fz_s2);padding:.5vh 0">
            <i class="fas fa-sync"></i> Última actualización: ${new Date().toLocaleTimeString('es-ES')}
        </div>
    ` : `
        <div style="color:#666;font-style:italic;text-align:center;padding:20px;">
            <i class="fas fa-info-circle"></i> No hay noticias disponibles
        </div>
    `;
    
    $('.descripcion_com').html(html);
}

// 📅 FUNCIÓN PARA OBTENER FECHA LOCAL CORRECTA
function obtenerFechaLocal() {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// 📅 FUNCIÓN PARA FORMATEAR FECHA SIN ZONA HORARIA
function formatearFechaLocal(fechaString) {
    if (!fechaString) return 'Sin fecha';
    
    // DIVIDIR fecha sin crear objeto Date (evita zona horaria)
    const [year, month, day] = fechaString.split('-');
    return `${day}/${month}/${year}`;
}
// ACTUALIZAR FUNCIÓN DE INICIALIZACIÓN
async function inicializarDashboard(wi) {
    try {
        const mesActual = new Date().toISOString().slice(0, 7);
        currentMonth = mesActual;
        $('#monthSelector').val(mesActual);
        $('#fechaTour').val(obtenerFechaLocal()); 
        
        await Promise.all([
            cargarEmpleados(),
            cargarVentas(),
            cargarUltimoGanador(),
            cargarTours(),
            cargarNotas()  // ← AGREGAR ESTA LÍNEA
        ]);
        
        actualizarFiltroEmpleados();
        actualizarResumenCompetencia();
        
        // INICIALIZAR SELECTOR DE TOURS
        initTourSelector();
        
    } catch (error) {
        console.error('Error inicializando dashboard:', error);
        Notificacion('Error cargando datos del dashboard', 'error');
    }
}

// CARGAR EMPLEADOS OPTIMIZADO
async function cargarEmpleados() {
    try {
        // Verificar cache primero
        const empleadosCache = getls('empleadosSmile');
        if (empleadosCache) {
            todosLosEmpleados = empleadosCache;
            renderizarEmpleados();
        }

        // Obtener empleados que participan
        const empleadosQuery = query(collection(db, 'smiles'), where('participa', '==', 'si'));
        const empleadosSnapshot = await getDocs(empleadosQuery);
        
        todosLosEmpleados = empleadosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Guardar en cache
        savels('empleadosSmile', todosLosEmpleados, 300);
        
        await calcularPuntosEmpleados();
        renderizarEmpleados();
        
    } catch (error) {
        console.error('Error cargando empleados:', error);
        $('#workersGrid').html(`
            <div class="error-workers">
                <i class="fas fa-exclamation-triangle"></i>
                Error cargando empleados
            </div>
        `);
    }
}

// CALCULAR PUNTOS DE EMPLEADOS
async function calcularPuntosEmpleados() {
    try {
        // Obtener ventas del mes actual
        const ventasSnapshot = await getDocs(collection(db, 'registrosdb'));
        
        // Filtrar por mes actual
        const ventasDelMes = ventasSnapshot.docs.filter(doc => {
            const venta = doc.data();
            return venta.fechaTour && venta.fechaTour.startsWith(currentMonth);
        });

        // Calcular puntos por empleado
        todosLosEmpleados.forEach(empleado => {
            const ventasEmpleado = ventasDelMes.filter(doc => 
                doc.data().vendedor === empleado.usuario
            );
            
            empleado.totalPuntos = ventasEmpleado.reduce((sum, doc) => 
                sum + (doc.data().puntos || 0), 0
            );
            empleado.totalVentas = ventasEmpleado.reduce((sum, doc) => 
                sum + (doc.data().qventa || 0), 0
            );
        });

        // Ordenar por puntos
        todosLosEmpleados.sort((a, b) => b.totalPuntos - a.totalPuntos);
        
    } catch (error) {
        console.error('Error calculando puntos:', error);
    }
}

// RENDERIZAR EMPLEADOS
function renderizarEmpleados() {
    const workersHTML = todosLosEmpleados.map((empleado, index) => {
        const rank = index + 1;
        const isChampion = rank === 1;
        const isRunnerUp = rank === 2;
        
        return `
            <div class="worker-card ${isChampion ? 'champion' : isRunnerUp ? 'runner-up' : ''}" data-employee="${empleado.usuario}">
                <div class="rank-badge">
                    <i class="fas fa-${isChampion ? 'crown' : isRunnerUp ? 'medal' : 'user'}"></i>
                    #${rank}
                </div>
                <div class="worker-avatar">
                    <img src="${empleado.imagen || '/smile.png'}" alt="${empleado.nombre}">
                    <div class="status-online"></div>
                </div>
                <div class="worker-info">
                    <h3>${empleado.nombre}</h3>
                    <p>${empleado.descripcion}</p>
                </div>
                <div class="worker-points">
                    <span class="points-number">${empleado.totalPuntos || 0}</span>
                    <span class="points-label">puntos</span>
                </div>
                <div class="worker-stats">
                    <div class="stat">
                        <span class="stat-value">${empleado.totalVentas || 0}</span>
                        <span class="stat-label">Tours Vendidos</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    $('#workersGrid').html(workersHTML);
}

// CARGAR VENTAS
async function cargarVentas() {
    try {
        const ventasSnapshot = await getDocs(collection(db, 'registrosdb'));
        todasLasVentas = ventasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Ordenar por fecha más reciente
        todasLasVentas.sort((a, b) => {
            const fechaA = new Date(a.fechaTour || '1970-01-01');
            const fechaB = new Date(b.fechaTour || '1970-01-01');
            return fechaB - fechaA;
        });
        
        renderizarTablaVentas();
        
    } catch (error) {
        console.error('Error cargando ventas:', error);
        $('#salesTableBody').html(`
            <tr><td colspan="9" class="error-cell">
                <i class="fas fa-exclamation-triangle"></i> Error cargando ventas
            </td></tr>
        `);
    }
}

// FUNCIÓN ACTUALIZADA PARA RENDERIZAR TABLA DE VENTAS
function renderizarTablaVentas(filtroEmpleado = '', soloHoy = false) {
    let ventasFiltradas = [...todasLasVentas];
    
    // Filtrar por mes actual
    ventasFiltradas = ventasFiltradas.filter(venta => 
        venta.fechaTour && venta.fechaTour.startsWith(currentMonth)
    );
    
    // Filtrar por empleado
    if (filtroEmpleado) {
        ventasFiltradas = ventasFiltradas.filter(venta => 
            venta.vendedor === filtroEmpleado
        );
    }
    
    // Filtrar por hoy
    if (soloHoy) {
        const hoy = new Date().toISOString().split('T')[0];
        ventasFiltradas = ventasFiltradas.filter(venta => 
            venta.fechaTour === hoy
        );
    }
    
    // Paginación
    const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
    const inicio = (currentPage - 1) * ventasPorPagina;
    const ventasPagina = ventasFiltradas.slice(inicio, inicio + ventasPorPagina);
    
    // Renderizar filas con nueva estructura
    const filas = ventasPagina.map(venta => {
        const esPropietario = venta.vendedor === userAuth?.displayName;
        const botones = esPropietario 
            ? `<button class="btn-view" onclick="verDetalleVenta('${venta.id}')" title="Ver detalles"><i class="fas fa-eye"></i></button>
               <button class="btn-edit" onclick="editarVenta('${venta.id}')" title="Editar"><i class="fas fa-edit"></i></button>
               <button class="btn-delete" onclick="eliminarVenta('${venta.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>`
            : `<button class="btn-view" onclick="verDetalleVenta('${venta.id}')" title="Ver detalles"><i class="fas fa-eye"></i></button>`;
        
        // Formatear fecha
        const fechaFormateada = formatearFechaLocal(venta.fechaTour);
        
        // Cliente con habitación usando mis6
        const clienteInfo = `${mis10(venta.nombreCliente, 15)}${venta.numeroHabitacion ? ` <small>(${venta.numeroHabitacion}</small>)` : ''}`;
        
        // Calcular comisión (ejemplo: 10% del importe individual)
        
        return `
            <tr>
                <td>${fechaFormateada}</td>
                <td class="user-cell">
                    <img src="${todosLosEmpleados.find(emp => emp.usuario === venta.vendedor)?.imagen || '/smile.png'}" class="avatar-small">
                    <strong>${Capi(venta.vendedor)}</strong>
                </td>
                <td><span class="tour-badge">${venta.tipoTour}</span></td>
                <td><span class="pax-badge"><i class="fas fa-users"></i> ${venta.cantidadPax}</span></td>
                <td>${clienteInfo}</td>
                <td><strong class="price">S/ ${(venta.importeTotal || 0).toFixed(2)}</strong></td>
                <td>S/ ${(venta.precioUnitario || 0).toFixed(2)}</td>
                <td><span class="status-badge ${(venta.estadoPago === 'pagado' || venta.estadoPago === 'cobrado') ? 'paid' : 'pending'}">
                    <i class="fas fa-${(venta.estadoPago === 'pagado' || venta.estadoPago === 'cobrado') ? 'check-circle' : 'clock'}"></i> 
                    ${obtenerEstadoSimplificado(venta.estadoPago)}
                </span></td>
                <td>S/ ${(venta.ganancia || 0).toFixed(2)}</td>
                <td><span class="points-badge"><i class="fas fa-star"></i> ${venta.puntos || 0}</span></td>
                <td><div class="action-buttons">${botones}</div></td>
            </tr>
        `;
    }).join('');
    
    $('#salesTableBody').html(filas || `<tr><td colspan="11" class="empty-cell"><i class="fas fa-inbox"></i> No hay ventas para mostrar</td></tr>`);
    renderizarPaginacion(totalPaginas);
}

// 📋 FUNCIÓN PARA SIMPLIFICAR ESTADOS DE PAGO
function obtenerEstadoSimplificado(estadoPago) {
    const estados = {
        'pagado': 'PAGADO',
        'cobrado': 'PAGADO', 
        'cobrar': 'DEUDA'
    };
    return estados[estadoPago] || 'DEUDA';
}

// FUNCIÓN PARA OBTENER ETIQUETAS DE VENTAS ESPECIALES
function obtenerEtiquetasVentas(venta) {
    let etiquetas = [];
    
    if (venta.esVentaJulio) {
        etiquetas.push('<span class="venta-especial julio">Julio</span>');
    }
    if (venta.esVentaSonia) {
        etiquetas.push('<span class="venta-especial sonia">Sonia</span>');
    }
    if (venta.esVentaExterna) {
        etiquetas.push('<span class="venta-especial externa">Externa</span>');
    }
    
    return etiquetas.length > 0 ? etiquetas.join(' ') : '';
}

// RENDERIZAR PAGINACIÓN
function renderizarPaginacion(totalPaginas) {
    if (totalPaginas <= 1) {
        $('#paginationContainer').html('');
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Botón anterior
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="cambiarPagina(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="page-btn" onclick="cambiarPagina(${i})">${i}</button>`;
        }
    }
    
    // Botón siguiente
    if (currentPage < totalPaginas) {
        paginationHTML += `<button class="page-btn" onclick="cambiarPagina(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    paginationHTML += '</div>';
    $('#paginationContainer').html(paginationHTML);
}

// CARGAR ÚLTIMO GANADOR
async function cargarUltimoGanador() {
    try {
        // Calcular mes anterior
        const mesAnterior = calcularMesAnterior(currentMonth);
        const docId = `${mesAnterior.replace('-', '')}`;
        
        // Verificar si ya existe ganador registrado
        const ganadorDoc = await getDoc(doc(db, 'ganadores', docId));
        
        if (ganadorDoc.exists()) {
            // Ya existe ganador registrado
            renderizarUltimoGanador(ganadorDoc.data());
            return;
        }
        
        // No existe, calcular automáticamente
        const ventasSnapshot = await getDocs(collection(db, 'registrosdb'));
        const puntosVendedores = {};
        
        // Calcular puntos del mes anterior
        ventasSnapshot.docs.forEach(doc => {
            const venta = doc.data();
            if (venta.fechaTour?.startsWith(mesAnterior)) {
                const vendedor = venta.vendedor;
                if (!puntosVendedores[vendedor]) {
                    puntosVendedores[vendedor] = { puntos: 0, ventas: 0 };
                }
                puntosVendedores[vendedor].puntos += (venta.puntos || 0);
                puntosVendedores[vendedor].ventas += (venta.qventa || 0);
            }
        });
        
        // Encontrar ganador
        const vendedoresArray = Object.entries(puntosVendedores);
        if (vendedoresArray.length === 0) {
            $('#lastWinner').html(`
                <div class="winner-header">
                    <i class="fas fa-trophy"></i>
                    <h3>Ganador del Mes Anterior</h3>
                </div>
                <div class="no-winner">
                    <i class="fas fa-question-circle"></i>
                    <span>No hay datos disponibles</span>
                </div>
            `);
            return;
        }
        
        // Ordenar y obtener ganador
        vendedoresArray.sort((a, b) => b[1].puntos - a[1].puntos);
        const [ganador, datos] = vendedoresArray[0];
        
        // Crear objeto ganador
        const [year, month] = mesAnterior.split('-');
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const ganadorData = {
            ganador,
            puntosGanados: datos.puntos,
            totalVentas: datos.ventas,
            mes: meses[parseInt(month) - 1],
            year,
            mesCompleto: mesAnterior,
            fechaRegistro: serverTimestamp()
        };
        
        // Registrar en colección ganadores para futuras consultas
        await setDoc(doc(db, 'ganadores', docId), ganadorData);
        
        renderizarUltimoGanador(ganadorData);
        
    } catch (error) {
        console.error('Error:', error);
        $('#lastWinner').html(`
            <div class="winner-header">
                <i class="fas fa-trophy"></i>
                <h3>Ganador del Mes Anterior</h3>
            </div>
            <div class="error-winner">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Error cargando datos</span>
            </div>
        `);
    }
}

// RENDERIZAR ÚLTIMO GANADOR
function renderizarUltimoGanador(ganadorData) {
    const empleado = todosLosEmpleados.find(emp => 
        emp.usuario === ganadorData.ganador || emp.nombre === ganadorData.ganador
    );
    
    $('#lastWinner').html(`
        <div class="winner-header">
            <i class="fas fa-trophy"></i>
            <h3>Ganador del Mes Anterior</h3>
        </div>
        <div class="winner-info">
            <img src="${empleado?.imagen || '/smile.png'}" 
                 alt="${empleado?.nombre || ganadorData.ganador}">
            <div class="winner-details">
                <h4>${empleado?.nombre || ganadorData.ganador}</h4>
                <p>${ganadorData.mes} ${ganadorData.year}</p>
                <span class="winner-points">${ganadorData.puntosGanados} puntos</span>
                <span class="winner-sales">${ganadorData.totalVentas} tours</span>
            </div>
            <div class="winner-achievement">
                <i class="fas fa-crown"></i>
                <span>¡Campeón!</span>
            </div>
        </div>
    `);
}

// ACTUALIZAR RESUMEN DE COMPETENCIA
function actualizarResumenCompetencia() {
    const ventasDelMes = todasLasVentas.filter(venta => 
        venta.fechaTour && venta.fechaTour.startsWith(currentMonth)
    );
    
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventasDelMes.filter(venta => venta.fechaTour === hoy);
    
    const totalTours = ventasDelMes.reduce((sum, venta) => sum + (venta.qventa || 0), 0);
    const totalPuntos = ventasDelMes.reduce((sum, venta) => sum + (venta.puntos || 0), 0);
    const toursHoy = ventasHoy.reduce((sum, venta) => sum + (venta.qventa || 0), 0);
    const meta = 2500;
    
    // 📊 ACTUALIZAR VALORES
    $('#totalTours').text(totalTours);
    $('#totalPuntos').text(totalPuntos);
    $('#toursHoy').text(toursHoy);
    
    // 🎨 ACTUALIZAR CSS DINÁMICO - SÚPER COMPACTO
    const stats = [
        Math.min((toursHoy / 5) * 100, 100),      // Tours hoy %
        Math.min((totalTours / 50) * 100, 100),   // Total tours %
        Math.min((totalPuntos / meta) * 100, 100), // Puntos %
        100                                        // Meta 100%
    ];
    
    $('.summary-stat').each((i, el) => {
        const grados = (stats[i] / 100) * 360;
        $(el).css({
            '--progress': `${grados}deg`,
            '--width': `${stats[i]}%`
        });
    });
}

// ACTUALIZAR FILTRO DE EMPLEADOS
function actualizarFiltroEmpleados() {
    const empleadosOptions = todosLosEmpleados.map(emp => 
        `<option value="${emp.usuario}">${emp.nombre}</option>`
    ).join('');
    
    $('#filterEmployee').html(`
        <option value="">Todos los vendedores</option>
        ${empleadosOptions}
    `);
}

// Agregar después de la línea 776 (eventos auxiliares)
$(document).on('change', '#mostrarn', function() {
    ventasPorPagina = parseInt($(this).val());
    currentPage = 1;
    renderizarTablaVentas($('#filterEmployee').val());
});

// EVENTOS Y FUNCIONES AUXILIARES
$(document).on('change', '#monthSelector', function() {
    currentMonth = $(this).val();
    currentPage = 1;
    
    // Recargar datos para el nuevo mes
    Promise.all([
        calcularPuntosEmpleados(),
        cargarVentas()
    ]).then(() => {
        renderizarEmpleados();
        renderizarTablaVentas();
        actualizarResumenCompetencia();
        cargarUltimoGanador();
    });
});

$(document).on('change', '#filterEmployee', function() {
    currentPage = 1;
    renderizarTablaVentas($(this).val());
});

$(document).on('click', '#todayFilter', function() {
    currentPage = 1;
    renderizarTablaVentas($('#filterEmployee').val(), true);
});

// FUNCIONES GLOBALES PARA PAGINACIÓN Y ACCIONES
// FUNCIONES GLOBALES PARA PAGINACIÓN Y ACCIONES
window.cambiarPagina = function(pagina) {
    currentPage = pagina;
    renderizarTablaVentas($('#filterEmployee').val());
};

window.verDetalleVenta = function(ventaId) {
    const venta = todasLasVentas.find(v => v.id === ventaId);
    if (!venta) {
        Notificacion('Venta no encontrada', 'error');
        return;
    }
    
    // Cargar datos en el formulario (solo vista, no editable)
    cargarDatosEnFormulario(venta, true); // true = solo vista
    
    // Scroll al formulario
    document.querySelector('#formularioVenta').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    Notificacion('Datos cargados para visualización', 'info');
};

window.editarVenta = function(ventaId) {
    const venta = todasLasVentas.find(v => v.id === ventaId);
    if (!venta) {
        Notificacion('Venta no encontrada', 'error');
        return;
    }
    
    // Cargar datos en el formulario (editable)
    cargarDatosEnFormulario(venta, false); // false = editable
    
    // Cambiar el botón de guardar a actualizar
    $('.btn-save').html('<i class="fas fa-edit"></i> Actualizar Venta').attr('data-edit-id', ventaId);
    
    // Scroll al formulario
    document.querySelector('#formularioVenta').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    Notificacion('Datos cargados para edición', 'info');
};

window.eliminarVenta = function(ventaId) {
    const venta = todasLasVentas.find(v => v.id === ventaId);
    if (!venta) {
        Notificacion('Venta no encontrada', 'error');
        return;
    }
    
    // Primera confirmación
    const confirmacion1 = confirm(`¿Estás seguro de eliminar la venta de "${venta.nombreCliente}"?\n\nEsta acción NO se puede deshacer.`);
    
    if (!confirmacion1) return;
    
    // Segunda confirmación
    const confirmacion2 = confirm(`⚠️ CONFIRMACIÓN FINAL ⚠️\n\nSe eliminará permanentemente:\n• Cliente: ${venta.nombreCliente}\n• Tour: ${venta.tipoTour}\n• Importe: S/ ${venta.importeTotal}\n\n¿CONFIRMAS LA ELIMINACIÓN?\n\nEsta acción es IRREVERSIBLE.`);
    
    if (!confirmacion2) return;
    
    // Proceder con la eliminación
    eliminarVentaCompleta(ventaId);
};


// FUNCIÓN ACTUALIZADA PARA CARGAR DATOS EN FORMULARIO
function cargarDatosEnFormulario(venta, soloVista = false) {
    limpiarEstadoFormulario();
    
    // Buscar y seleccionar el tour
    selTour = htours.find(t => 
        t.tour === venta.tipoTour || 
        venta.tipoTour.includes(t.tour.split(' ')[1]) // Búsqueda flexible
    );
    
    if (selTour) {
        $('#tourDisplay .tour-text').text(selTour.tour);
        $('#tipoTour').val(selTour.tour);
        // Marcar como seleccionado en tabla
        $(`.tour-row[data-tour*='"nt":${selTour.nt}']`).addClass('selected');
    } else {
        $('#tourDisplay .tour-text').text(venta.tipoTour || '🔍 Seleccionar tour...');
        $('#tipoTour').val(venta.tipoTour || '');
    }
    
    // Cargar resto de campos
    $('#registroEn').val(venta.registroEn);
    $('#nombreCliente').val(venta.nombreCliente);
    $('#numeroHabitacion').val(venta.numeroHabitacion || '');
    $('#tipoDocumento').val(venta.tipoDocumento || 'dni');
    $('#numeroDocumento').val(venta.numeroDocumento || '');
    $('#cantidadPax').val(venta.cantidadPax || 1);
    $('#precioUnitario').val(venta.precioUnitario || 0);
    $('#metodoPago').val(venta.metodoPago || '');
    $('#importeTotal').val(venta.importeTotal || 0);
    $('#ganancia').val(venta.ganancia || 0);
    calcularComision(); // Recalcular al cargar datos
    $('#horaSalida').val(venta.horaSalida);
    $('#Operador').val(venta.Operador);
    $('#PagoOperador').val(venta.PagoOperador || 0); // ← AGREGAR ESTA LÍNEA
    $('#Comentario').val(venta.Comentario);
    $('#fechaTour').val(venta.fechaTour);
    $('#estadoPago').val(venta.estadoPago || 'pagado');
    
    $('#vtJulio').prop('checked', venta.esVentaJulio || false);
    $('#vtSonia').prop('checked', venta.esVentaSonia || false);
    $('#vtExterna').prop('checked', venta.esVentaExterna || false);
    
    actualizarPuntosPreview();
    
    if (soloVista) {
        $('#formularioVenta input, #formularioVenta select, .tour-display').prop('disabled', true);
        $('.btn-save').prop('disabled', true).html('<i class="fas fa-eye"></i> Solo Vista');
        $('#formularioVenta').addClass('view-only');
        
        if ($('.btn-clear-view').length === 0) {
            $('.form-actions').prepend(`
                <button type="button" class="btn-clear-view" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">
                    <i class="fas fa-times"></i> Limpiar Vista
                </button>
            `);
        }
    } else {
        $('#formularioVenta input, #formularioVenta select').prop('disabled', false);
        $('.tour-display').prop('disabled', false);
        $('.btn-save').prop('disabled', false);
        $('#formularioVenta').addClass('edit-mode');
        
        if ($('.btn-cancel-edit').length === 0) {
            $('.form-actions').prepend(`
                <button type="button" class="btn-cancel-edit" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">
                    <i class="fas fa-times"></i> Cancelar Edición
                </button>
            `);
        }
    }
}

// FUNCIÓN ACTUALIZADA PARA ACTUALIZAR PUNTOS
function actualizarPuntosPreview() {
    const pax = parseInt($('#cantidadPax').val()) || 1;
    const puntosBase = selTour ? selTour.pts : 0;
    
    const tieneVentaEspecial = $('#vtJulio').prop('checked') || 
                               $('#vtSonia').prop('checked') || 
                               $('#vtExterna').prop('checked');
    
    const puntosFinales = tieneVentaEspecial ? 0 : (puntosBase * pax);
    $('#vistaPreviaLaPuntos').text(puntosFinales);
}

// FUNCIÓN PARA LIMPIAR ESTADO DEL FORMULARIO
function limpiarEstadoFormulario() {
    // 💾 GUARDAR valores por defecto antes del reset
    const fechaHoy = obtenerFechaLocal(); // ← CAMBIO AQUÍ
    const paxDefecto = 1;
    
    selTour = null;
    $('#formularioVenta input, #formularioVenta select').prop('disabled', false);
    $('.btn-save').prop('disabled', false);
    $('#formularioVenta').removeClass('view-only edit-mode');
    $('.btn-save').html('<i class="fas fa-save"></i> Guardar Venta').removeAttr('data-edit-id');
    $('.btn-clear-view, .btn-cancel-edit').remove();
    $('#formularioVenta')[0].reset();
    
    // 🔄 RESTAURAR valores por defecto DESPUÉS del reset
    $('#cantidadPax').val(paxDefecto);
    $('#fechaTour').val(fechaHoy); // ← USAR FECHA CORREGIDA
    $('#vistaPreviaLaPuntos').text('0');
    $('#tourDisplay .tour-text').text('🔍 Seleccionar tour...');
    $('.tour-row').removeClass('selected');
    
    // 🔒 MANTENER campos disabled que deben estarlo
    $('#importeTotal').prop('disabled', true);
}

// FUNCIÓN PARA ELIMINAR VENTA COMPLETA
async function eliminarVentaCompleta(ventaId) {
    try {
        // Mostrar indicador de carga
        Notificacion('Eliminando venta...', 'info');
        
        // Eliminar de Firebase
        await deleteDoc(doc(db, 'registrosdb', ventaId));
        
        // Eliminar de localStorage (buscar todas las claves que puedan contener esta venta)
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('vendedor_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.idVenta === ventaId) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    // Ignorar errores de parsing
                }
            }
        }
        
        // Remover las claves encontradas
        keysToRemove.forEach(key => localStorage.removeItem(key));
        // Actualizar datos locales
        todasLasVentas = todasLasVentas.filter(v => v.id !== ventaId);
        
        // Actualizar interfaz
        await calcularPuntosEmpleados();
        renderizarEmpleados();
        renderizarTablaVentas();
        actualizarResumenCompetencia();
        
        // Limpiar formulario si tenía datos de esta venta
        const editId = $('.btn-save').attr('data-edit-id');
        if (editId === ventaId) {
            limpiarEstadoFormulario();
        }
        
        Notificacion('¡Venta eliminada exitosamente!', 'success');
        
    } catch (error) {
        console.error('Error eliminando venta:', error);
        Notificacion('Error al eliminar la venta. Inténtalo nuevamente.', 'error');
    }
}

// EVENTOS PARA BOTONES ADICIONALES
$(document).on('click', '.btn-clear-view', function() {
    limpiarEstadoFormulario();
    Notificacion('Vista limpiada', 'info');
});

$(document).on('click', '.btn-cancel-edit', function() {
    limpiarEstadoFormulario();
    Notificacion('Edición cancelada', 'info');
});

// FUNCIONES AUXILIARES
function calcularMesAnterior(mesActual) {
    const [year, month] = mesActual.split('-');
    const fecha = new Date(parseInt(year), parseInt(month) - 2); // -2 porque mes es 0-indexed
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

// DATOS DE TOURS OPTIMIZADOS
let htours = [];

// CARGAR TOURS DESDE FIREBASE - SÚPER COMPACTO
async function cargarTours() {
    try {
        console.log('🔄 Cargando tours...');
        
        // 🚀 CACHE PRIMERO
        const cache = getls('toursSmile');
        if (cache?.length > 0) {
            htours = cache.map(t => ({
                nt: t.num || Math.random(),
                tour: t.tour,
                price: t.precio,
                pts: t.puntos,
                com: t.comision || 5
            }));
            console.log(`✅ ${htours.length} tours desde cache`);
            if (typeof initTourSelector === 'function') initTourSelector();
            return;
        }
        
        // 📡 DESDE FIREBASE
        const snapshot = await getDocs(query(collection(db, 'listatours'), where('activo', '==', true)));
        if (snapshot.empty) {
            console.log('❌ No hay tours activos');
            htours = [];
            return;
        }
        
        const toursData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        
        // Convertir formato para compatibilidad
        htours = toursData.map(t => ({
            nt: t.num || Math.random(),
            tour: t.tour,
            price: t.precio,
            pts: t.puntos,
            com: t.comision || 5
        }));
        
        // 💾 GUARDAR CACHE (5 minutos)
        savels('toursSmile', toursData, 300);
        
        console.log(`✅ ${htours.length} tours cargados desde Firebase`);
        if (typeof initTourSelector === 'function') initTourSelector();
        
    } catch (error) {
        console.error('❌ Error cargando tours:', error);
        Notificacion('Error al cargar tours', 'error');
    }
}

// VARIABLE PARA TOUR SELECCIONADO
let selTour = null;

// FUNCIÓN ACTUALIZADA PARA GENERAR HTML DEL FORMULARIO
function getFormularioHTML() {
    return `
        <form id="formularioVenta" class="sale-form">
            <div class="form-grid">
                <!-- SELECTOR DE TOUR MEJORADO -->
                <div class="form-field">
                    <label class="tour-label">
                        <i class="fas fa-route"></i>
                        Tipo de Tour *
                    </label>
                    <div class="tour-selector" id="tourSelector">
                        <div class="tour-display" id="tourDisplay">
                            <span class="tour-text">🔍 Seleccionar tour...</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="tour-dropdown" id="tourDropdown">
                            <div class="tour-search">
                                <input type="text" id="tourSearch" placeholder="Buscar tour..." autocomplete="off">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="tour-table-container">
                                <table class="tour-table" id="tourTable">
                                    <tbody id="tourTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" id="tipoTour" required>
                </div>

                <!-- RESTO DE CAMPOS EXISTENTES -->
                <div class="form-field">
                    <label><i class="fas fa-hotel"></i>Registro en:</label>
                    <select id="registroEn">
                        <option value="hawka">Hawka</option>
                        <option value="hclaudia">HClaudia</option>
                    </select>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-bed"></i>N° Habitación(Opcional)</label>
                    <input type="text" id="numeroHabitacion" placeholder="Ej: 205">
                </div>

                <div class="form-field">
                    <label><i class="fas fa-user"></i>Nombre del Cliente *</label>
                    <input type="text" id="nombreCliente" required placeholder="Nombre de cliente / calle">
                </div>

                <div class="form-field">
                    <label><i class="fas fa-clock"></i>Hora de salida *</label>
                    <input type="text" id="horaSalida" placeholder="2 HORAS -5PM" required>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-id-card"></i>Tipo de Documento</label>
                    <select id="tipoDocumento">
                        <option value="dni">DNI</option>
                        <option value="pasaporte">Pasaporte</option>
                        <option value="cedula">Cédula</option>
                        <option value="ce">Carnet Extranjería</option>
                    </select>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-hashtag"></i>N° DNI/Pasaporte/CE</label>
                    <input type="text" id="numeroDocumento" placeholder="78964523">
                </div>

                <div class="form-field">
                    <label><i class="fas fa-credit-card"></i>Método de Pago</label>
                    <select id="metodoPago">
                    <option value="">Seleccionar...</option>
                        <option value="Tarjeta">Tarjeta de Débito/Crédito</option>
                        <option value="Transferencia">Transferencia Bancaria</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Yape">Yape</option>
                        <option value="Plin">Plin</option>
                    </select>
                </div>  

                <div class="form-field">
                    <label><i class="fas fa-users"></i>PAX (Cantidad Personas/Grupo Privado)</label>
                    <input type="number" id="cantidadPax" required min="1" value="1">
                </div>  

                <div class="form-field">
                    <label><i class="fas fa-user-tag"></i>Importe Individual/Grupo Privado</label>
                    <input type="number" id="precioUnitario" step="0.01" placeholder="S/ 0.00">
                </div>

                <div class="form-field">
                    <label><i class="fas fa-calculator"></i>Total por Pagar(S/)</label>
                    <input type="number" id="importeTotal" step="0.01" placeholder="S/ 0.00" disabled>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-user"></i>Operador *</label>
                    <input type="text" id="Operador" placeholder="Ejm: Jacki, Pili, William...." required>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-money-bill"></i>Pago al operador (S/) *</label>
                    <input type="number" id="PagoOperador" step="0.01" placeholder="0.00" required>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-money-check-alt"></i>Estado del Pago:</label>
                    <select id="estadoPago">
                        <option id="ep01" value="pagado">Pagado (Tour con nosotros) </option>
                        <option id="ep02" value="pagado">Transferido hacia nosotros(<-)</option>
                        <option id="ep03" value="cobrar">Transferido con Deuda(->)</option>
                        <option id="ep04" value="cobrado">Deuda Saldada(Arreglada ->)</option>
                    </select>
                </div>

                <div class="form-field">
                    <label title="Es un calculo importe total - comision del operador, si es nosotros, no tiene comision, si es externo depende del tour">
                    <i class="fas fa-handshake"></i>Ganancia Estimada*</label>
                    <input type="number" id="ganancia" step="0.01" placeholder="S/ 0.00" disabled>
                </div>

                <div class="form-field">
                    <label><i class="fas fa-calendar-day"></i>Fecha *</label>
                    <input type="date" id="fechaTour" required>
                </div>

                <div class="form-field">
                    <label><i class="fa-solid fa-comment"></i>Comentario/Anotes (Opcional) *</label>
                    <input type="text" id="Comentario" placeholder="Escribe notas de tu venta(opcional)" required>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-save">
                    <i class="fas fa-save"></i>
                    Guardar Venta
                </button>
                <div class="points-preview">
                    <div class="points-info">
                        <i class="fas fa-star"></i>
                        <span>Puntos a ganar: <strong id="vistaPreviaLaPuntos">0</strong></span>
                    </div>
                </div>
            </div>
        </form>
    `;
}

// REEMPLAZAR función initTourSelector() (línea 1080)
function initTourSelector() {
    // SOLO renderizar una vez al inicializar
    renderTourTable(htours);
    
    // REMOVER listeners existentes para evitar duplicados
    $('#tourDisplay').off('click');
    $('#tourSearch').off('input');
    $(document).off('click', '.tour-row');
    
    // Toggle dropdown - OPTIMIZADO
    $('#tourDisplay').on('click', function(e) {
        e.stopPropagation();
        const dropdown = $('#tourDropdown');
        const isActive = dropdown.hasClass('active');
        
        if (isActive) {
            dropdown.removeClass('active');
            $('#tourDisplay').removeClass('active');
        } else {
            dropdown.addClass('active');
            $('#tourDisplay').addClass('active');
            // FOCUS DIFERIDO para evitar bloqueo
            setTimeout(() => $('#tourSearch').focus(), 50);
        }
    });
    
    // Búsqueda OPTIMIZADA con debounce
    let searchTimeout;
    $('#tourSearch').on('input', function() {
        const query = $(this).val().toLowerCase();
        
        // CANCELAR búsqueda anterior
        if (searchTimeout) clearTimeout(searchTimeout);
        
        // DEBOUNCE de 200ms
        searchTimeout = setTimeout(() => {
            if (query.length === 0) {
                renderTourTableOptimized(htours);
            } else if (query.length >= 2) {
                const filtered = htours.filter(t => 
                    t.tour.toLowerCase().includes(query) ||
                    t.price.toString().includes(query)
                );
                renderTourTableOptimized(filtered);
            }
        }, 200);
    });
    
    // Event listener para selección - OPTIMIZADO
    $(document).on('click', '.tour-row', function(e) {
        e.stopPropagation();
        
        // OBTENER datos del dataset (más rápido que JSON.parse)
        const tourIndex = $(this).data('index');
        selTour = htours[tourIndex];
        
        if (!selTour) return;
        
        // ACTUALIZAR interfaz
        $('#tourDisplay .tour-text').text(selTour.tour);
        $('#tipoTour').val(selTour.tour);
        $('#precioUnitario').val(selTour.price);
        
        // CERRAR dropdown inmediatamente
        $('#tourDropdown').removeClass('active');
        $('#tourDisplay').removeClass('active');
        
        // MARCAR como seleccionado
        $('.tour-row').removeClass('selected');
        $(this).addClass('selected');
        
        // CÁLCULOS diferidos para no bloquear UI
        setTimeout(() => {
            aplicarZoomTemporal('#precioUnitario');
            calcularTotal();
            actualizarPuntosPreview();
        }, 50);
    });
    
    // Cerrar al hacer click fuera - OPTIMIZADO
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.tour-selector').length) {
            $('#tourDropdown').removeClass('active');
            $('#tourDisplay').removeClass('active');
        }
    });

    // RENDERIZAR tabs dinámicos
    renderizarPuntosDinamicos();
    renderizarPreciosDinamicos(); 
}

// NUEVA función de renderizado OPTIMIZADA
function renderTourTableOptimized(tours) {
    if (!tours.length) {
        $('#tourTableBody').html('<tr><td colspan="4" style="text-align:center;color:#666;">No hay tours disponibles</td></tr>');
        return;
    }
    
    // USAR fragment para renderizado más rápido
    const fragment = document.createDocumentFragment();
    
    tours.forEach((tour, index) => {
        const row = document.createElement('tr');
        row.className = 'tour-row';
        row.dataset.index = htours.indexOf(tour); // USAR índice en lugar de JSON
        
        row.innerHTML = `
            <td class="tour-num">${index + 1}</td>
            <td class="tour-name">${tour.tour}</td>
            <td class="tour-price">S/ ${tour.price}</td>
            <td class="tour-pts">${tour.pts} pts</td>
        `;
        
        fragment.appendChild(row);
    });
    
    // LIMPIAR y agregar todo de una vez
    const tbody = document.getElementById('tourTableBody');
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

// ACTUALIZAR función renderTourTable original para compatibilidad
// function renderTourTable(tours) {
//     renderTourTableOptimized(tours);
// }

// ACTUALIZAR función renderTourTable original para compatibilidad
function renderTourTable(tours) {
    renderTourTableOptimized(tours);
}

// CALCULAR COMISIÓN Y GANANCIA
function calcularComision() {
    const estadoPago = $('#estadoPago').val();
    const importeTotal = parseFloat($('#importeTotal').val()) || 0;
    const pagoOperador = parseFloat($('#PagoOperador').val()) || 0;
    
    let ganancia = 0;
    
    // LÓGICA ACTUALIZADA SEGÚN ESTADO DE PAGO
    if (estadoPago === 'pagado') {
        // "Pagado" y "Transferido hacia nosotros" = ganancia total
        ganancia = importeTotal;
        $('#PagoOperador').prop('disabled', true).attr('placeholder', 'El servicio hemos hecho nosotros').val('0');
    } else if (estadoPago === 'cobrar' || estadoPago === 'cobrado') {
        // "Transferido con Deuda" y "Deuda Saldada" = total - pago operador
        ganancia = importeTotal - pagoOperador;
        $('#PagoOperador').prop('disabled', false).attr('placeholder', '0.00');
    }
    
    $('#ganancia').val(ganancia.toFixed(2));
    aplicarZoomTemporal('#ganancia');
}

// 🔄 ACTUALIZAR PLACEHOLDER Y CÁLCULO AL CAMBIAR ESTADO DE PAGO
// 🔄 EVENTOS AUTOMÁTICOS PARA RECÁLCULO
$(document).on('change', '#estadoPago', function() {
    calcularComision();
});

$(document).on('input', '#importeTotal, #PagoOperador', function() {
    calcularComision();
});

$(document).on('input', '#cantidadPax, #precioUnitario', function() {
    calcularTotal();
    calcularComision(); // ← AGREGAR ESTE LLAMADO
});

// FUNCIÓN PARA APLICAR EFECTO ZOOM TEMPORAL
function aplicarZoomTemporal(selector) {
    const elemento = $(selector);
    elemento.addClass('field-updated');
    
    setTimeout(() => {
        elemento.removeClass('field-updated');
    }, 1000);
}


// CALCULAR TOTAL
function calcularTotal() {
    const pax = parseInt($('#cantidadPax').val()) || 1;
    const precio = parseFloat($('#precioUnitario').val()) || 0;
    $('#importeTotal').val((precio * pax).toFixed(2));
    calcularComision();
    
    // Aplicar zoom temporal a los campos actualizados
    aplicarZoomTemporal('#importeTotal');
}

function getInfoTabsHTML() {
    return `
        <!-- INFORMACION DE SERVICIOS -->
        <section class="info-section">
            <div class="info-tabs">
                <button class="tab-btn active" data-tab="points">
                    <i class="fas fa-star"></i>
                    Puntos
                </button>
                <button class="tab-btn" data-tab="rules">
                    <i class="fas fa-list-ul"></i>
                    Reglas
                </button>
                <button class="tab-btn" data-tab="prices">
                    <i class="fas fa-money-bill-wave"></i>
                    Precios
                </button>
            </div>

<div class="tab-content active" id="points-tab">
    <h3><i class="fas fa-chart-bar"></i> Asignación de Puntos por Servicio</h3>
    <div class="points-grid" id="pointsGrid">
        <div class="loading-points">
            <i class="fas fa-spinner fa-spin"></i>
            Cargando puntos...
        </div>
    </div>
</div>

            <div class="tab-content" id="rules-tab">
                <h3><i class="fas fa-gavel"></i> Reglas del Sistema de Puntos</h3>
                <div class="rules-list">
                    <div class="rule-item">
                        <span class="rule-number">1</span>
                        <span>EN LOS PRECIOS BRINDADOS NO ESTÁ INCLUÍDO LA TASA TURÍSTICA</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-number">2</span>
                        <span>EN EL CASO DEL BUGGIE/BODEGAS Y CITY TOUR EL PUNTAJE SERÁ MAYOR SIEMPRE Y CUANDO SALGAN CON EL BUGGIE DE LA SEÑORA SONIA O CAMIONETA</span>
                    </div>
                    <div class="rule-item bonus">
                        <span class="rule-number">3</span>
                        <span>SE ANULARÁN LOS PUNTOS POR ALGÚN RECLAMO. SI EL CLIENTE DEJA COMENTARIO A FAVOR HAY BONUS DE +10 PUNTOS. MAL COMENTARIO = -10 PUNTOS</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-number">4</span>
                        <span>SI SE REALIZA ANULACIÓN DE TOUR O DEVOLUCIÓN DE DINERO NO SE DARÁN PUNTAJES</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-number">5</span>
                        <span>PARA QUE LOS PUNTOS SEAN VÁLIDOS SE DEBE REGISTRAR COMPLETO TODOS LOS DATOS EL MISMO DÍA</span>
                    </div>
                    <div class="rule-item bonus">
                        <span class="rule-number">5</span>
                        <span>SI EL CLIENTE TE ETIQUETA EN REDES SOCIALES = +5 PUNTOS BONUS, PERO DEJA COMENTARIO = +5 (MÁXIMO 10 POR CLIENTE) </span>
                    </div>
                </div>
            </div>

      <div class="tab-content" id="prices-tab">
    <h3><i class="fas fa-tags"></i> Precios de Tours - Venta Mínima</h3>
    <div class="prices-grid" id="pricesGrid">
        <div class="loading-prices">
            <i class="fas fa-spinner fa-spin"></i>
            Cargando precios...
        </div>
    </div>
    <div class="price-note">
        <p><i class="fas fa-info-circle"></i> <strong>Nota:</strong> Precios actualizados automáticamente desde la base de datos</p>
    </div>
    </div>

            </div>
        </section>
    `;
}

// ...existing code...
// Agregar después de la función cargarTours()
function renderizarPuntosDinamicos() {
    if (!htours.length) {
        $('#pointsGrid').html('<p style="text-align:center;color:#666;">No hay tours disponibles</p>');
        return;
    }
    
    // Ordenar por puntos (mayor a menor)
    const toursOrdenados = [...htours].sort((a, b) => b.pts - a.pts);
    
    const html = toursOrdenados.map(tour => `
        <div class="point-item">
            <span class="service-name">${tour.tour}</span>
            <span class="point-value">${tour.pts}</span>
        </div>
    `).join('');
    
    $('#pointsGrid').html(html);
}

function renderizarPreciosDinamicos() {
    if (!htours.length) {
        $('#pricesGrid').html('<p style="text-align:center;color:#666;">No hay precios disponibles</p>');
        return;
    }
    
    const html = htours.map(tour => `
        <div class="price-item">
            <span class="service-name">${tour.tour}</span>
            <span class="service-price">S/ ${tour.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    $('#pricesGrid').html(html);
}

// JQUERY CONTENIDO JS [Start] 
// FUNCIONES UTILES [START]
// $('#importeTotal').attr('disabled','disabled');
// FUNCIONES UTILES [END]
// EVENTO ACTUALIZADO PARA GUARDAR VENTAS CON ANIMACIÓN Y PROTECCIÓN
$(document).on('click', '.btn-save', async (e) => {
    e.preventDefault();
    
    // 🚫 PROTECCIÓN CONTRA DUPLICADOS
    if ($('.btn-save').prop('disabled')) return;
    
    try {
        if (!selTour) {
            Notificacion('⚠️ Selecciona un tour primero', 'error');
            $('#tourDisplay').focus();
            return;
        }
        
        // 🎬 INICIAR ANIMACIÓN Y DESHABILITAR
        const $btnSave = $('.btn-save');
        const textoOriginal = $btnSave.html();
        $btnSave.prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin"></i> Guardando venta...');
        
        const editId = $('.btn-save').attr('data-edit-id');
        const isEditing = !!editId;
        const pax = parseInt($('#cantidadPax').val()) || 1;
        
        // Verificar ventas especiales
        const esVentaJulio = $('#vtJulio').prop('checked');
        const esVentaSonia = $('#vtSonia').prop('checked');
        const esVentaExterna = $('#vtExterna').prop('checked');
        
        const tieneVentaEspecial = esVentaJulio || esVentaSonia || esVentaExterna;
        const puntosFinales = tieneVentaEspecial ? 0 : (selTour.pts * pax);
        
        const formData = {
            tipoTour: selTour.tour,
            registroEn: $('#registroEn').val(),
            nombreCliente: $('#nombreCliente').val(),
            numeroHabitacion: $('#numeroHabitacion').val(),
            tipoDocumento: $('#tipoDocumento').val(),
            numeroDocumento: $('#numeroDocumento').val(),
            cantidadPax: pax,
            precioUnitario: parseFloat($('#precioUnitario').val()) || 0,
            metodoPago: $('#metodoPago').val(),
            importeTotal: parseFloat($('#importeTotal').val()) || 0,
            ganancia: parseFloat($('#ganancia').val()) || 0,
            horaSalida: $('#horaSalida').val(),
            Operador: $('#Operador').val(),
            PagoOperador: parseFloat($('#PagoOperador').val()) || 0, // ← AGREGAR ESTA LÍNEA
            Comentario: $('#Comentario').val(),
            fechaTour: $('#fechaTour').val(),
            estadoPago: $('#estadoPago').val(),
            vendedor: userAuth.displayName,
            puntos: puntosFinales,
            email: userAuth.email,
            qventa: 1,
            fechaRegistro: serverTimestamp(),
            esVentaJulio: esVentaJulio,
            esVentaSonia: esVentaSonia,
            esVentaExterna: esVentaExterna
        };

        // VALIDACIÓN VISUAL COMPACTA
        const campos = [
            [selTour, '#tourDisplay', 'tour'],
            [formData.nombreCliente, '#nombreCliente', 'Cliente'],
            [formData.horaSalida, '#horaSalida', 'Hora'],
            [formData.fechaTour, '#fechaTour', 'Fecha'],
            [formData.Operador, '#Operador', 'Operador'],
            [formData.numeroDocumento, '#numeroDocumento', 'Documento'],
            [formData.metodoPago, '#metodoPago', 'y Metodo de pago'],
        ];

        $('.faltaValor, .okValor').removeClass('faltaValor okValor');
        const faltantes = campos.filter(([val, sel, nom]) => {
            const ok = val && val.toString().trim();
            $(sel).addClass(ok ? 'okValor' : 'faltaValor');
            return !ok ? nom : null;
        }).map(([,,nom]) => nom).filter(Boolean);

        if (faltantes.length) {
            // 🔄 RESTAURAR BOTÓN SI HAY ERRORES
            $btnSave.prop('disabled', false).html(textoOriginal);
            Notificacion(`⚠️ Completa: ${faltantes.join(', ')}`, 'error');
            $('.faltaValor').first().focus();
            return;
        }

        if (isEditing) {
            formData.idVenta = editId;
            await setDoc(doc(db, 'registrosdb', editId), formData);
            
            const vendedorId = `vendedor_${userAuth.displayName}`;
            savels(vendedorId, formData, 450);
            
            const index = todasLasVentas.findIndex(v => v.id === editId);
            if (index !== -1) {
                todasLasVentas[index] = { id: editId, ...formData };
            }
            
            Notificacion('¡Venta actualizada exitosamente!', 'success');
        } else {
            const timestamp = Date.now();
            const docId = `venta_${timestamp}`;
            formData.idVenta = docId;
            
            await setDoc(doc(db, 'registrosdb', docId), formData);
            
            const vendedorId = `vendedor_${userAuth.displayName}`;
            savels(vendedorId, formData, 450);
            
            Notificacion('¡Venta registrada exitosamente!', 'success');
        }
        
        // 🧹 LIMPIAR TODO Y RESETEAR
        $('.faltaValor, .okValor').removeClass('faltaValor okValor');
        limpiarEstadoFormulario();
        await cargarVentas();
        await calcularPuntosEmpleados();
        renderizarEmpleados();
        actualizarResumenCompetencia();
        
    } catch (error) {
        console.error('Error al guardar/actualizar venta:', error);
        Notificacion('Error al procesar la venta. Inténtalo nuevamente.', 'error');
        // 🔄 RESTAURAR BOTÓN EN CASO DE ERROR
        $('.btn-save').prop('disabled', false).html('<i class="fas fa-save"></i> Guardar Venta');
    }
});

// EVENTOS ACTUALIZADOS PARA CHECKBOXES Y CAMPOS
$(document).on('change', '#vtJulio, #vtSonia, #vtExterna', function() {
    actualizarPuntosPreview();
});

// Validación visual para TODOS los inputs del formulario - COMPACTO
$(document).on('input change', '#formularioVenta input, #formularioVenta select', function() {
    const valor = $(this).val()?.toString().trim();
    $(this).removeClass('faltaValor').addClass(valor ? 'okValor' : 'faltaValor');
});

$(document).on('click', '.tour-row', function() {
    $('#tourDisplay').removeClass('faltaValor').addClass('okValor');
});

// Resto de eventos del formulario
$(document).on('change', '#tipoTour', function() {
    const precio = $(this).find('option:selected').data('price') || 0;
    const pax = parseInt($('#cantidadPax').val()) || 1;
    
    $('#precioUnitario').val(precio);
    $('#importeTotal').val(precio * pax);
    actualizarPuntosPreview();
});

$(document).on('input', '#cantidadPax, #precioUnitario', function() {
    calcularTotal();
    actualizarPuntosPreview();
    calcularComision(); // ← AGREGAR ESTE LLAMADO
    // const pax = parseInt($('#cantidadPax').val()) || 1;
    // const precio = parseFloat($('#precioUnitario').val()) || 0;
    
    // $('#importeTotal').val(precio * pax);
    // actualizarPuntosPreview();
});

// PARA GUARDAR EL TEMA
$(document).on('click','.tema',async function(){
  const miTema = $(this).data('tema');
  try {
    await setDoc(doc(db, 'configuracion', userAuth.displayName), {
      tema: miTema,
      actualizado: serverTimestamp()
    }, { merge: true });
    savels('wiTema', miTema, 72);
    Mensaje('Tema guardado <i class="fa-solid fa-circle-check"></i>');
  }catch(e){console.error(e)}
});

// AGREGAR DESPUÉS DE LA LÍNEA ~74 (después de las variables globales)

// 🔄 FUNCIÓN WIFRESH PARA ACTUALIZACIONES INTELIGENTES
async function wifresh() {
    try {
        const $btn = $('.wifresh');
        const iconoOriginal = $btn.html();
        
        // 🎬 INICIAR ANIMACIÓN
        $btn.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
        Notificacion('🔄 Verificando actualizaciones...', 'info');
        
        // 📊 DETECTAR CAMBIOS DISPONIBLES
        const cambiosDetectados = await detectarCambios();
        
        if (!cambiosDetectados.hayActualizaciones) {
            $btn.html(iconoOriginal).prop('disabled', false);
            Notificacion('✅ Todo está actualizado', 'success');
            return;
        }
        
        // 🚀 APLICAR ACTUALIZACIONES ENCONTRADAS
        Notificacion(`🔄 Aplicando ${cambiosDetectados.total} actualizaciones...`, 'info');
        
        const promesasActualizacion = [];
        
        // ACTUALIZAR EMPLEADOS
        if (cambiosDetectados.empleados) {
            promesasActualizacion.push(actualizarEmpleados());
        }
        
        // ACTUALIZAR TOURS
        if (cambiosDetectados.tours) {
            promesasActualizacion.push(actualizarTours());
        }
        
        // ACTUALIZAR VENTAS
        if (cambiosDetectados.ventas) {
            promesasActualizacion.push(actualizarVentas());
        }
        
        // ACTUALIZAR NOTAS
        if (cambiosDetectados.notas) {
            promesasActualizacion.push(actualizarNotas());
        }
        
        // EJECUTAR TODAS LAS ACTUALIZACIONES EN PARALELO
        await Promise.all(promesasActualizacion);
        
        // 🎯 ACTUALIZAR INTERFAZ
        await Promise.all([
            calcularPuntosEmpleados(),
            actualizarResumenCompetencia()
        ]);
        
        renderizarEmpleados();
        renderizarTablaVentas();
        initTourSelector();
        
        // ✅ FINALIZAR
        $btn.html(iconoOriginal).prop('disabled', false);
        Notificacion(`✅ ${cambiosDetectados.total} actualizaciones aplicadas correctamente`, 'success');
        
    } catch (error) {
        console.error('❌ Error en wifresh:', error);
        $('.wifresh').html('<i class="fa-solid fa-rotate-right"></i>').prop('disabled', false);
        Notificacion('❌ Error en actualización. Inténtalo nuevamente.', 'error');
    }
}

// 🔍 DETECTAR CAMBIOS DISPONIBLES
async function detectarCambios() {
    const cambios = {
        empleados: false,
        tours: false,
        ventas: false,
        notas: false,
        total: 0,
        hayActualizaciones: false
    };
    
    try {
        // VERIFICAR EMPLEADOS
        const empleadosCache = getls('empleadosSmile');
        if (!empleadosCache || esCacheExpirado('empleadosSmile', 300)) {
            cambios.empleados = true;
            cambios.total++;
        }
        
        // VERIFICAR TOURS
        const toursCache = getls('toursSmile');
        if (!toursCache || esCacheExpirado('toursSmile', 300)) {
            cambios.tours = true;
            cambios.total++;
        }
        
        // VERIFICAR VENTAS (siempre actualizar para datos en tiempo real)
        cambios.ventas = true;
        cambios.total++;
        
        // VERIFICAR NOTAS
        const notasCache = getls('notasSmile');
        if (!notasCache || esCacheExpirado('notasSmile', 600)) {
            cambios.notas = true;
            cambios.total++;
        }
        
        cambios.hayActualizaciones = cambios.total > 0;
        
    } catch (error) {
        console.error('Error detectando cambios:', error);
    }
    
    return cambios;
}

// 🕒 VERIFICAR SI CACHE ESTÁ EXPIRADO
function esCacheExpirado(clave, tiempoMaximo) {
    try {
        const item = localStorage.getItem(clave + '_timestamp');
        if (!item) return true;
        
        const timestamp = parseInt(item);
        const ahora = Date.now();
        const diferencia = (ahora - timestamp) / 1000; // segundos
        
        return diferencia > tiempoMaximo;
    } catch {
        return true;
    }
}

// 🔄 FUNCIONES DE ACTUALIZACIÓN ESPECÍFICAS
async function actualizarEmpleados() {
    removels('empleadosSmile');
    await cargarEmpleados();
}

async function actualizarTours() {
    removels('toursSmile');
    await cargarTours();
}

async function actualizarVentas() {
    await cargarVentas();
}

async function actualizarNotas() {
    removels('notasSmile');
    await cargarNotas();
}

// 🔄 EVENTO WIFRESH INTELIGENTE
$(document).on('click', '.wifresh', function(e) {
    e.preventDefault();
    wifresh();
});


// JQUERY CONTENIDO JS [End] 
// DIOS SIEMPRE ES BUENO Y YO AMO A DIOS [END]