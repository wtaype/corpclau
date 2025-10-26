import{o as da,$ as e,c as ua,e as aa,M as J,N as l,f as pa,d as $,a as m,b as _,s as H,h as A,m as ma,C as fa,i as D,j as N,g as va,k as O,r as W,q as Y,w as Q,l as oa}from"./widev-gnjhKW3_.js";let P=null;da(oa,async a=>{if(!a)return window.location.href="/";P=a;try{const t=O("wiSmile");if(t)return ea(t);const s=(await D(Y(N(m,"smiles"),Q("usuario","==",a.displayName)))).docs[0].data();A("wiSmile",s,450),ea(s)}catch(t){console.error(t)}});e(document).on("click",".bt_salir",async()=>{await ua(oa),window.location.href="/";try{localStorage.clear()}catch{Object.keys(localStorage).forEach(t=>localStorage.removeItem(t))}});e(document).on("click",".tab-btn",function(){const a=e(this).data("tab");aa(this,"active"),aa("#"+a+"-tab","active")});e(document).on("click",".bt_cargar",()=>{const a=/^(im\d+|ki\d+|remote:im\d+|dirty:im\d+|dirty:ki\d+|toursSmile|notasSmile)$/;Object.keys(localStorage).filter(t=>a.test(t)).forEach(t=>localStorage.removeItem(t)),J("Actualizado"),setTimeout(()=>location.reload(),800)});let I="2025-09",h=1,G=5,b=[],y=[];function ea(a){console.log(a.nombre),J("Bienvenido "+a.nombre+"!"),e(".app").html(`
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
                            <img src="${a.imagen||"/smile.png"}" alt="${a.nombre}" class="user-avatar">
                            <span class="user-name">${a.nombre}</span>
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

                    ${wa()}
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

            ${Pa()}
        </main>

        <div id="notifications-container"></div>
        <div id="modal-container"></div>

<footer class='foo hwb txc'>
<p>Creado con<i class='wicon wi-corazon'></i>by<a class='ftx lkme' href='https://wtaype.github.io/' target='_blank'>@wilder.taype</a>2025 - <span class='wty'></span><span class='abw tm11042025' id='101542394703517594'>| Acerca del app | Actualizado</span><span class='wtu'></span></p>
</footer>
    `),ba()}async function sa(){try{console.log("🔄 Cargando notas admin...");const a=O("notasSmile");if(a?.length>0){console.log(`✅ ${a.length} notas desde cache`),F(a);return}const t=await D(N(m,"notas"));if(t.empty){console.log("📭 No hay notas"),F([]);return}const o=t.docs.map(s=>({id:s.id,...s.data()}));A("notasSmile",o,600),console.log(`✅ ${o.length} notas cargadas`),F(o)}catch(a){console.error("❌ Error cargar notas:",a),F([])}}function F(a){const t=a.length>0?`
        ${a.map(o=>`<li>${o.nota}</li>`).join("")}
        <div style="font-size:var(--fz_s2);padding:.5vh 0">
            <i class="fas fa-sync"></i> Última actualización: ${new Date().toLocaleTimeString("es-ES")}
        </div>
    `:`
        <div style="color:#666;font-style:italic;text-align:center;padding:20px;">
            <i class="fas fa-info-circle"></i> No hay noticias disponibles
        </div>
    `;e(".descripcion_com").html(t)}function ia(){const a=new Date,t=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),s=String(a.getDate()).padStart(2,"0");return`${t}-${o}-${s}`}function ha(a){if(!a)return"Sin fecha";const[t,o,s]=a.split("-");return`${s}/${o}/${t}`}async function ba(a){try{const t=new Date().toISOString().slice(0,7);I=t,e("#monthSelector").val(t),e("#fechaTour").val(ia()),await Promise.all([na(),B(),ra(),ca(),sa()]),Ea(),L(),V()}catch(t){console.error("Error inicializando dashboard:",t),l("Error cargando datos del dashboard","error")}}async function na(){try{const a=O("empleadosSmile");a&&(y=a,x());const t=Y(N(m,"smiles"),Q("participa","==","si"));y=(await D(t)).docs.map(s=>({id:s.id,...s.data()})),A("empleadosSmile",y,300),await R(),x()}catch(a){console.error("Error cargando empleados:",a),e("#workersGrid").html(`
            <div class="error-workers">
                <i class="fas fa-exclamation-triangle"></i>
                Error cargando empleados
            </div>
        `)}}async function R(){try{const t=(await D(N(m,"registrosdb"))).docs.filter(o=>{const s=o.data();return s.fechaTour&&s.fechaTour.startsWith(I)});y.forEach(o=>{const s=t.filter(n=>n.data().vendedor===o.usuario);o.totalPuntos=s.reduce((n,r)=>n+(r.data().puntos||0),0),o.totalVentas=s.reduce((n,r)=>n+(r.data().qventa||0),0)}),y.sort((o,s)=>s.totalPuntos-o.totalPuntos)}catch(a){console.error("Error calculando puntos:",a)}}function x(){const a=y.map((t,o)=>{const s=o+1,n=s===1,r=s===2;return`
            <div class="worker-card ${n?"champion":r?"runner-up":""}" data-employee="${t.usuario}">
                <div class="rank-badge">
                    <i class="fas fa-${n?"crown":r?"medal":"user"}"></i>
                    #${s}
                </div>
                <div class="worker-avatar">
                    <img src="${t.imagen||"/smile.png"}" alt="${t.nombre}">
                    <div class="status-online"></div>
                </div>
                <div class="worker-info">
                    <h3>${t.nombre}</h3>
                    <p>${t.descripcion}</p>
                </div>
                <div class="worker-points">
                    <span class="points-number">${t.totalPuntos||0}</span>
                    <span class="points-label">puntos</span>
                </div>
                <div class="worker-stats">
                    <div class="stat">
                        <span class="stat-value">${t.totalVentas||0}</span>
                        <span class="stat-label">Tours Vendidos</span>
                    </div>
                </div>
            </div>
        `}).join("");e("#workersGrid").html(a)}async function B(){try{b=(await D(N(m,"registrosdb"))).docs.map(t=>({id:t.id,...t.data()})),b.sort((t,o)=>{const s=new Date(t.fechaTour||"1970-01-01");return new Date(o.fechaTour||"1970-01-01")-s}),S()}catch(a){console.error("Error cargando ventas:",a),e("#salesTableBody").html(`
            <tr><td colspan="9" class="error-cell">
                <i class="fas fa-exclamation-triangle"></i> Error cargando ventas
            </td></tr>
        `)}}function S(a="",t=!1){let o=[...b];if(o=o.filter(i=>i.fechaTour&&i.fechaTour.startsWith(I)),a&&(o=o.filter(i=>i.vendedor===a)),t){const i=new Date().toISOString().split("T")[0];o=o.filter(c=>c.fechaTour===i)}const s=Math.ceil(o.length/G),n=(h-1)*G,E=o.slice(n,n+G).map(i=>{const f=i.vendedor===P?.displayName?`<button class="btn-view" onclick="verDetalleVenta('${i.id}')" title="Ver detalles"><i class="fas fa-eye"></i></button>
               <button class="btn-edit" onclick="editarVenta('${i.id}')" title="Editar"><i class="fas fa-edit"></i></button>
               <button class="btn-delete" onclick="eliminarVenta('${i.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>`:`<button class="btn-view" onclick="verDetalleVenta('${i.id}')" title="Ver detalles"><i class="fas fa-eye"></i></button>`,T=ha(i.fechaTour),d=`${ma(i.nombreCliente)}${i.numeroHabitacion?` <small>(${i.numeroHabitacion}</small>)`:""}`;return`
            <tr>
                <td>${T}</td>
                <td class="user-cell">
                    <img src="${y.find(w=>w.usuario===i.vendedor)?.imagen||"/smile.png"}" class="avatar-small">
                    <strong>${fa(i.vendedor)}</strong>
                </td>
                <td><span class="tour-badge">${i.tipoTour}</span></td>
                <td><span class="pax-badge"><i class="fas fa-users"></i> ${i.cantidadPax}</span></td>
                <td>${d}</td>
                <td><strong class="price">S/ ${(i.importeTotal||0).toFixed(2)}</strong></td>
                <td>S/ ${(i.precioUnitario||0).toFixed(2)}</td>
                <td><span class="status-badge ${i.estadoPago==="pagado"||i.estadoPago==="cobrado"?"paid":"pending"}">
                    <i class="fas fa-${i.estadoPago==="pagado"||i.estadoPago==="cobrado"?"check-circle":"clock"}"></i> 
                    ${ga(i.estadoPago)}
                </span></td>
                <td>S/ ${(i.ganancia||0).toFixed(2)}</td>
                <td><span class="points-badge"><i class="fas fa-star"></i> ${i.puntos||0}</span></td>
                <td><div class="action-buttons">${f}</div></td>
            </tr>
        `}).join("");e("#salesTableBody").html(E||'<tr><td colspan="11" class="empty-cell"><i class="fas fa-inbox"></i> No hay ventas para mostrar</td></tr>'),ya(s)}function ga(a){return{pagado:"PAGADO",cobrado:"PAGADO",cobrar:"DEUDA"}[a]||"DEUDA"}function ya(a){if(a<=1){e("#paginationContainer").html("");return}let t='<div class="pagination">';h>1&&(t+=`<button class="page-btn" onclick="cambiarPagina(${h-1})">
            <i class="fas fa-chevron-left"></i>
        </button>`);for(let o=1;o<=a;o++)o===h?t+=`<button class="page-btn active">${o}</button>`:t+=`<button class="page-btn" onclick="cambiarPagina(${o})">${o}</button>`;h<a&&(t+=`<button class="page-btn" onclick="cambiarPagina(${h+1})">
            <i class="fas fa-chevron-right"></i>
        </button>`),t+="</div>",e("#paginationContainer").html(t)}async function ra(){try{const a=Ta(I),t=`${a.replace("-","")}`,o=await va($(m,"ganadores",t));if(o.exists()){ta(o.data());return}const s=await D(N(m,"registrosdb")),n={};s.docs.forEach(w=>{const g=w.data();if(g.fechaTour?.startsWith(a)){const v=g.vendedor;n[v]||(n[v]={puntos:0,ventas:0}),n[v].puntos+=g.puntos||0,n[v].ventas+=g.qventa||0}});const r=Object.entries(n);if(r.length===0){e("#lastWinner").html(`
                <div class="winner-header">
                    <i class="fas fa-trophy"></i>
                    <h3>Ganador del Mes Anterior</h3>
                </div>
                <div class="no-winner">
                    <i class="fas fa-question-circle"></i>
                    <span>No hay datos disponibles</span>
                </div>
            `);return}r.sort((w,g)=>g[1].puntos-w[1].puntos);const[E,i]=r[0],[c,f]=a.split("-"),T=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],d={ganador:E,puntosGanados:i.puntos,totalVentas:i.ventas,mes:T[parseInt(f)-1],year:c,mesCompleto:a,fechaRegistro:_()};await H($(m,"ganadores",t),d),ta(d)}catch(a){console.error("Error:",a),e("#lastWinner").html(`
            <div class="winner-header">
                <i class="fas fa-trophy"></i>
                <h3>Ganador del Mes Anterior</h3>
            </div>
            <div class="error-winner">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Error cargando datos</span>
            </div>
        `)}}function ta(a){const t=y.find(o=>o.usuario===a.ganador||o.nombre===a.ganador);e("#lastWinner").html(`
        <div class="winner-header">
            <i class="fas fa-trophy"></i>
            <h3>Ganador del Mes Anterior</h3>
        </div>
        <div class="winner-info">
            <img src="${t?.imagen||"/smile.png"}" 
                 alt="${t?.nombre||a.ganador}">
            <div class="winner-details">
                <h4>${t?.nombre||a.ganador}</h4>
                <p>${a.mes} ${a.year}</p>
                <span class="winner-points">${a.puntosGanados} puntos</span>
                <span class="winner-sales">${a.totalVentas} tours</span>
            </div>
            <div class="winner-achievement">
                <i class="fas fa-crown"></i>
                <span>¡Campeón!</span>
            </div>
        </div>
    `)}function L(){const a=b.filter(c=>c.fechaTour&&c.fechaTour.startsWith(I)),t=new Date().toISOString().split("T")[0],o=a.filter(c=>c.fechaTour===t),s=a.reduce((c,f)=>c+(f.qventa||0),0),n=a.reduce((c,f)=>c+(f.puntos||0),0),r=o.reduce((c,f)=>c+(f.qventa||0),0),E=2500;e("#totalTours").text(s),e("#totalPuntos").text(n),e("#toursHoy").text(r);const i=[Math.min(r/5*100,100),Math.min(s/50*100,100),Math.min(n/E*100,100),100];e(".summary-stat").each((c,f)=>{const T=i[c]/100*360;e(f).css({"--progress":`${T}deg`,"--width":`${i[c]}%`})})}function Ea(){const a=y.map(t=>`<option value="${t.usuario}">${t.nombre}</option>`).join("");e("#filterEmployee").html(`
        <option value="">Todos los vendedores</option>
        ${a}
    `)}e(document).on("change","#mostrarn",function(){G=parseInt(e(this).val()),h=1,S(e("#filterEmployee").val())});e(document).on("change","#monthSelector",function(){I=e(this).val(),h=1,Promise.all([R(),B()]).then(()=>{x(),S(),L(),ra()})});e(document).on("change","#filterEmployee",function(){h=1,S(e(this).val())});e(document).on("click","#todayFilter",function(){h=1,S(e("#filterEmployee").val(),!0)});window.cambiarPagina=function(a){h=a,S(e("#filterEmployee").val())};window.verDetalleVenta=function(a){const t=b.find(o=>o.id===a);if(!t){l("Venta no encontrada","error");return}la(t,!0),document.querySelector("#formularioVenta").scrollIntoView({behavior:"smooth",block:"start"}),l("Datos cargados para visualización","info")};window.editarVenta=function(a){const t=b.find(o=>o.id===a);if(!t){l("Venta no encontrada","error");return}la(t,!1),e(".btn-save").html('<i class="fas fa-edit"></i> Actualizar Venta').attr("data-edit-id",a),document.querySelector("#formularioVenta").scrollIntoView({behavior:"smooth",block:"start"}),l("Datos cargados para edición","info")};window.eliminarVenta=function(a){const t=b.find(n=>n.id===a);if(!t){l("Venta no encontrada","error");return}!confirm(`¿Estás seguro de eliminar la venta de "${t.nombreCliente}"?

Esta acción NO se puede deshacer.`)||!confirm(`⚠️ CONFIRMACIÓN FINAL ⚠️

Se eliminará permanentemente:
• Cliente: ${t.nombreCliente}
• Tour: ${t.tipoTour}
• Importe: S/ ${t.importeTotal}

¿CONFIRMAS LA ELIMINACIÓN?

Esta acción es IRREVERSIBLE.`)||Sa(a)};function la(a,t=!1){z(),u=p.find(o=>o.tour===a.tipoTour||a.tipoTour.includes(o.tour.split(" ")[1])),u?(e("#tourDisplay .tour-text").text(u.tour),e("#tipoTour").val(u.tour),e(`.tour-row[data-tour*='"nt":${u.nt}']`).addClass("selected")):(e("#tourDisplay .tour-text").text(a.tipoTour||"🔍 Seleccionar tour..."),e("#tipoTour").val(a.tipoTour||"")),e("#registroEn").val(a.registroEn),e("#nombreCliente").val(a.nombreCliente),e("#numeroHabitacion").val(a.numeroHabitacion||""),e("#tipoDocumento").val(a.tipoDocumento||"dni"),e("#numeroDocumento").val(a.numeroDocumento||""),e("#cantidadPax").val(a.cantidadPax||1),e("#precioUnitario").val(a.precioUnitario||0),e("#metodoPago").val(a.metodoPago||""),e("#importeTotal").val(a.importeTotal||0),e("#ganancia").val(a.ganancia||0),k(),e("#horaSalida").val(a.horaSalida),e("#Operador").val(a.Operador),e("#PagoOperador").val(a.PagoOperador||0),e("#Comentario").val(a.Comentario),e("#fechaTour").val(a.fechaTour),e("#estadoPago").val(a.estadoPago||"pagado"),e("#vtJulio").prop("checked",a.esVentaJulio||!1),e("#vtSonia").prop("checked",a.esVentaSonia||!1),e("#vtExterna").prop("checked",a.esVentaExterna||!1),U(),t?(e("#formularioVenta input, #formularioVenta select, .tour-display").prop("disabled",!0),e(".btn-save").prop("disabled",!0).html('<i class="fas fa-eye"></i> Solo Vista'),e("#formularioVenta").addClass("view-only"),e(".btn-clear-view").length===0&&e(".form-actions").prepend(`
                <button type="button" class="btn-clear-view" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">
                    <i class="fas fa-times"></i> Limpiar Vista
                </button>
            `)):(e("#formularioVenta input, #formularioVenta select").prop("disabled",!1),e(".tour-display").prop("disabled",!1),e(".btn-save").prop("disabled",!1),e("#formularioVenta").addClass("edit-mode"),e(".btn-cancel-edit").length===0&&e(".form-actions").prepend(`
                <button type="button" class="btn-cancel-edit" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">
                    <i class="fas fa-times"></i> Cancelar Edición
                </button>
            `))}function U(){const a=parseInt(e("#cantidadPax").val())||1,t=u?u.pts:0,s=e("#vtJulio").prop("checked")||e("#vtSonia").prop("checked")||e("#vtExterna").prop("checked")?0:t*a;e("#vistaPreviaLaPuntos").text(s)}function z(){const a=ia(),t=1;u=null,e("#formularioVenta input, #formularioVenta select").prop("disabled",!1),e(".btn-save").prop("disabled",!1),e("#formularioVenta").removeClass("view-only edit-mode"),e(".btn-save").html('<i class="fas fa-save"></i> Guardar Venta').removeAttr("data-edit-id"),e(".btn-clear-view, .btn-cancel-edit").remove(),e("#formularioVenta")[0].reset(),e("#cantidadPax").val(t),e("#fechaTour").val(a),e("#vistaPreviaLaPuntos").text("0"),e("#tourDisplay .tour-text").text("🔍 Seleccionar tour..."),e(".tour-row").removeClass("selected"),e("#importeTotal").prop("disabled",!0)}async function Sa(a){try{l("Eliminando venta...","info"),await pa($(m,"registrosdb",a));const t=[];for(let s=0;s<localStorage.length;s++){const n=localStorage.key(s);if(n&&n.startsWith("vendedor_"))try{const r=JSON.parse(localStorage.getItem(n));r&&r.idVenta===a&&t.push(n)}catch{}}t.forEach(s=>localStorage.removeItem(s)),b=b.filter(s=>s.id!==a),await R(),x(),S(),L(),e(".btn-save").attr("data-edit-id")===a&&z(),l("¡Venta eliminada exitosamente!","success")}catch(t){console.error("Error eliminando venta:",t),l("Error al eliminar la venta. Inténtalo nuevamente.","error")}}e(document).on("click",".btn-clear-view",function(){z(),l("Vista limpiada","info")});e(document).on("click",".btn-cancel-edit",function(){z(),l("Edición cancelada","info")});function Ta(a){const[t,o]=a.split("-"),s=new Date(parseInt(t),parseInt(o)-2);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}let p=[];async function ca(){try{console.log("🔄 Cargando tours...");const a=O("toursSmile");if(a?.length>0){p=a.map(s=>({nt:s.num||Math.random(),tour:s.tour,price:s.precio,pts:s.puntos,com:s.comision||5})),console.log(`✅ ${p.length} tours desde cache`),typeof V=="function"&&V();return}const t=await D(Y(N(m,"listatours"),Q("activo","==",!0)));if(t.empty){console.log("❌ No hay tours activos"),p=[];return}const o=t.docs.map(s=>({id:s.id,...s.data()}));p=o.map(s=>({nt:s.num||Math.random(),tour:s.tour,price:s.precio,pts:s.puntos,com:s.comision||5})),A("toursSmile",o,300),console.log(`✅ ${p.length} tours cargados desde Firebase`),typeof V=="function"&&V()}catch(a){console.error("❌ Error cargando tours:",a),l("Error al cargar tours","error")}}let u=null;function wa(){return`
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
    `}function V(){Ca(p),e("#tourDisplay").off("click"),e("#tourSearch").off("input"),e(document).off("click",".tour-row"),e("#tourDisplay").on("click",function(t){t.stopPropagation();const o=e("#tourDropdown");o.hasClass("active")?(o.removeClass("active"),e("#tourDisplay").removeClass("active")):(o.addClass("active"),e("#tourDisplay").addClass("active"),setTimeout(()=>e("#tourSearch").focus(),50))});let a;e("#tourSearch").on("input",function(){const t=e(this).val().toLowerCase();a&&clearTimeout(a),a=setTimeout(()=>{if(t.length===0)j(p);else if(t.length>=2){const o=p.filter(s=>s.tour.toLowerCase().includes(t)||s.price.toString().includes(t));j(o)}},200)}),e(document).on("click",".tour-row",function(t){t.stopPropagation();const o=e(this).data("index");u=p[o],u&&(e("#tourDisplay .tour-text").text(u.tour),e("#tipoTour").val(u.tour),e("#precioUnitario").val(u.price),e("#tourDropdown").removeClass("active"),e("#tourDisplay").removeClass("active"),e(".tour-row").removeClass("selected"),e(this).addClass("selected"),setTimeout(()=>{X("#precioUnitario"),Z(),U()},50))}),e(document).on("click",function(t){e(t.target).closest(".tour-selector").length||(e("#tourDropdown").removeClass("active"),e("#tourDisplay").removeClass("active"))}),Oa(),Aa()}function j(a){if(!a.length){e("#tourTableBody").html('<tr><td colspan="4" style="text-align:center;color:#666;">No hay tours disponibles</td></tr>');return}const t=document.createDocumentFragment();a.forEach((s,n)=>{const r=document.createElement("tr");r.className="tour-row",r.dataset.index=p.indexOf(s),r.innerHTML=`
            <td class="tour-num">${n+1}</td>
            <td class="tour-name">${s.tour}</td>
            <td class="tour-price">S/ ${s.price}</td>
            <td class="tour-pts">${s.pts} pts</td>
        `,t.appendChild(r)});const o=document.getElementById("tourTableBody");o.innerHTML="",o.appendChild(t)}function Ca(a){j(a)}function k(){const a=e("#estadoPago").val(),t=parseFloat(e("#importeTotal").val())||0,o=parseFloat(e("#PagoOperador").val())||0;let s=0;a==="pagado"?(s=t,e("#PagoOperador").prop("disabled",!0).attr("placeholder","El servicio hemos hecho nosotros").val("0")):(a==="cobrar"||a==="cobrado")&&(s=t-o,e("#PagoOperador").prop("disabled",!1).attr("placeholder","0.00")),e("#ganancia").val(s.toFixed(2)),X("#ganancia")}e(document).on("change","#estadoPago",function(){k()});e(document).on("input","#importeTotal, #PagoOperador",function(){k()});e(document).on("input","#cantidadPax, #precioUnitario",function(){Z(),k()});function X(a){const t=e(a);t.addClass("field-updated"),setTimeout(()=>{t.removeClass("field-updated")},1e3)}function Z(){const a=parseInt(e("#cantidadPax").val())||1,t=parseFloat(e("#precioUnitario").val())||0;e("#importeTotal").val((t*a).toFixed(2)),k(),X("#importeTotal")}function Pa(){return`
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
    `}function Oa(){if(!p.length){e("#pointsGrid").html('<p style="text-align:center;color:#666;">No hay tours disponibles</p>');return}const t=[...p].sort((o,s)=>s.pts-o.pts).map(o=>`
        <div class="point-item">
            <span class="service-name">${o.tour}</span>
            <span class="point-value">${o.pts}</span>
        </div>
    `).join("");e("#pointsGrid").html(t)}function Aa(){if(!p.length){e("#pricesGrid").html('<p style="text-align:center;color:#666;">No hay precios disponibles</p>');return}const a=p.map(t=>`
        <div class="price-item">
            <span class="service-name">${t.tour}</span>
            <span class="service-price">S/ ${t.price.toFixed(2)}</span>
        </div>
    `).join("");e("#pricesGrid").html(a)}e(document).on("click",".btn-save",async a=>{if(a.preventDefault(),!e(".btn-save").prop("disabled"))try{if(!u){l("⚠️ Selecciona un tour primero","error"),e("#tourDisplay").focus();return}const t=e(".btn-save"),o=t.html();t.prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i> Guardando venta...');const s=e(".btn-save").attr("data-edit-id"),n=!!s,r=parseInt(e("#cantidadPax").val())||1,E=e("#vtJulio").prop("checked"),i=e("#vtSonia").prop("checked"),c=e("#vtExterna").prop("checked"),T=E||i||c?0:u.pts*r,d={tipoTour:u.tour,registroEn:e("#registroEn").val(),nombreCliente:e("#nombreCliente").val(),numeroHabitacion:e("#numeroHabitacion").val(),tipoDocumento:e("#tipoDocumento").val(),numeroDocumento:e("#numeroDocumento").val(),cantidadPax:r,precioUnitario:parseFloat(e("#precioUnitario").val())||0,metodoPago:e("#metodoPago").val(),importeTotal:parseFloat(e("#importeTotal").val())||0,ganancia:parseFloat(e("#ganancia").val())||0,horaSalida:e("#horaSalida").val(),Operador:e("#Operador").val(),PagoOperador:parseFloat(e("#PagoOperador").val())||0,Comentario:e("#Comentario").val(),fechaTour:e("#fechaTour").val(),estadoPago:e("#estadoPago").val(),vendedor:P.displayName,puntos:T,email:P.email,qventa:1,fechaRegistro:_(),esVentaJulio:E,esVentaSonia:i,esVentaExterna:c},w=[[u,"#tourDisplay","tour"],[d.nombreCliente,"#nombreCliente","Cliente"],[d.horaSalida,"#horaSalida","Hora"],[d.fechaTour,"#fechaTour","Fecha"],[d.Operador,"#Operador","Operador"],[d.numeroDocumento,"#numeroDocumento","Documento"],[d.metodoPago,"#metodoPago","y Metodo de pago"]];e(".faltaValor, .okValor").removeClass("faltaValor okValor");const g=w.filter(([v,C,M])=>{const K=v&&v.toString().trim();return e(C).addClass(K?"okValor":"faltaValor"),K?null:M}).map(([,,v])=>v).filter(Boolean);if(g.length){t.prop("disabled",!1).html(o),l(`⚠️ Completa: ${g.join(", ")}`,"error"),e(".faltaValor").first().focus();return}if(n){d.idVenta=s,await H($(m,"registrosdb",s),d);const v=`vendedor_${P.displayName}`;A(v,d,450);const C=b.findIndex(M=>M.id===s);C!==-1&&(b[C]={id:s,...d}),l("¡Venta actualizada exitosamente!","success")}else{const C=`venta_${Date.now()}`;d.idVenta=C,await H($(m,"registrosdb",C),d);const M=`vendedor_${P.displayName}`;A(M,d,450),l("¡Venta registrada exitosamente!","success")}e(".faltaValor, .okValor").removeClass("faltaValor okValor"),z(),await B(),await R(),x(),L()}catch(t){console.error("Error al guardar/actualizar venta:",t),l("Error al procesar la venta. Inténtalo nuevamente.","error"),e(".btn-save").prop("disabled",!1).html('<i class="fas fa-save"></i> Guardar Venta')}});e(document).on("change","#vtJulio, #vtSonia, #vtExterna",function(){U()});e(document).on("input change","#formularioVenta input, #formularioVenta select",function(){const a=e(this).val()?.toString().trim();e(this).removeClass("faltaValor").addClass(a?"okValor":"faltaValor")});e(document).on("click",".tour-row",function(){e("#tourDisplay").removeClass("faltaValor").addClass("okValor")});e(document).on("change","#tipoTour",function(){const a=e(this).find("option:selected").data("price")||0,t=parseInt(e("#cantidadPax").val())||1;e("#precioUnitario").val(a),e("#importeTotal").val(a*t),U()});e(document).on("input","#cantidadPax, #precioUnitario",function(){Z(),U(),k()});e(document).on("click",".tema",async function(){const a=e(this).data("tema");try{await H($(m,"configuracion",P.displayName),{tema:a,actualizado:_()},{merge:!0}),A("wiTema",a,72),J('Tema guardado <i class="fa-solid fa-circle-check"></i>')}catch(t){console.error(t)}});async function Da(){try{const a=e(".wifresh"),t=a.html();a.html('<i class="fas fa-spinner fa-spin"></i>').prop("disabled",!0),l("🔄 Verificando actualizaciones...","info");const o=await Na();if(!o.hayActualizaciones){a.html(t).prop("disabled",!1),l("✅ Todo está actualizado","success");return}l(`🔄 Aplicando ${o.total} actualizaciones...`,"info");const s=[];o.empleados&&s.push(Va()),o.tours&&s.push($a()),o.ventas&&s.push(xa()),o.notas&&s.push(Ia()),await Promise.all(s),await Promise.all([R(),L()]),x(),S(),V(),a.html(t).prop("disabled",!1),l(`✅ ${o.total} actualizaciones aplicadas correctamente`,"success")}catch(a){console.error("❌ Error en wifresh:",a),e(".wifresh").html('<i class="fa-solid fa-rotate-right"></i>').prop("disabled",!1),l("❌ Error en actualización. Inténtalo nuevamente.","error")}}async function Na(){const a={empleados:!1,tours:!1,ventas:!1,notas:!1,total:0,hayActualizaciones:!1};try{(!O("empleadosSmile")||q("empleadosSmile",300))&&(a.empleados=!0,a.total++),(!O("toursSmile")||q("toursSmile",300))&&(a.tours=!0,a.total++),a.ventas=!0,a.total++,(!O("notasSmile")||q("notasSmile",600))&&(a.notas=!0,a.total++),a.hayActualizaciones=a.total>0}catch(t){console.error("Error detectando cambios:",t)}return a}function q(a,t){try{const o=localStorage.getItem(a+"_timestamp");if(!o)return!0;const s=parseInt(o);return(Date.now()-s)/1e3>t}catch{return!0}}async function Va(){W("empleadosSmile"),await na()}async function $a(){W("toursSmile"),await ca()}async function xa(){await B()}async function Ia(){W("notasSmile"),await sa()}e(document).on("click",".wifresh",function(a){a.preventDefault(),Da()});
