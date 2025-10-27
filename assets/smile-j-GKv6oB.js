import{$ as e,M as n,t as b,v as g,b as y,c as h,a as c,l as x,x as j,d as v,i as O,y as N,z as q,A as D,B as I,q as M,e as _,h as A}from"./widev-DMAHuOI-.js";const l={overlayActual:null,modalActual:null,callbacks:{},estilosInyectados:!1};function T(){if(l.estilosInyectados)return;e("head").append(`
    <style id="wimodal-styles">
      .wimodal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .wimodal-overlay.activo {
        opacity: 1;
      }
      
      .wimodal-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(30px);
        border: 1px solid var(--bg1);
        border-radius: 2vh;
        padding: 3vh 3vw;
        max-width: 60vw;
        width: 100%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 2vh 6vh rgba(0,0,0,0.3);
        transform: translateY(5vh);
        opacity: 0;
        transition: all 0.4s ease;
        position: relative;
      }
      
      .wimodal-container.activo {
        transform: translateY(0);
        opacity: 1;
      }
      
      .wimodal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3vh;
        padding-bottom: 2vh;
        border-bottom: 2px solid var(--bg);
      }
      
      .wimodal-title {
        color: var(--mco);
        font-size: clamp(1.5rem, 2vw, 1.8rem);
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 1vh;
      }
      
      .wimodal-close {
        width: 4vh;
        height: 4vh;
        border-radius: 50%;
        border: none;
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(1.1rem, 1.3vw, 1.2rem);
      }
      
      .wimodal-close:hover {
        background: var(--error);
        color: white;
        transform: rotate(90deg);
      }
      
      .wimodal-body {
        margin-bottom: 2vh;
      }
      
      .wimodal-footer {
        display: flex;
        gap: 1.5vh;
        justify-content: flex-end;
        margin-top: 2vh;
      }
      
      .wimodal-btn {
        border: none;
        padding: 1.2vh 2.5vw;
        border-radius: 1vh;
        font-weight: 700;
        font-size: clamp(0.9rem, 1.05vw, 1rem);
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: var(--ff_pop);
        box-shadow: 0 0.3vh 1vh rgba(0,0,0,0.2);
      }
      
      .wimodal-btn:hover {
        transform: translateY(-0.3vh);
        box-shadow: 0 0.5vh 1.5vh rgba(0,0,0,0.3);
      }
      
      .wimodal-btn-primary {
        background: linear-gradient(135deg, var(--mco), var(--hv));
        color: white;
      }
      
      .wimodal-btn-secondary {
        background: rgba(107, 114, 128, 0.2);
        color: var(--bg4);
      }
      
      .wimodal-btn-danger {
        background: linear-gradient(135deg, #ff3849, #dc2626);
        color: white;
      }
      
      .wimodal-btn-success {
        background: linear-gradient(135deg, #3cd741, #16a34a);
        color: white;
      }
      
      /* Estilos para formulario de proyecto */
      .wimodal-form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2vh;
        margin-bottom: 2vh;
      }
      
      .wimodal-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.8vh;
      }
      
      .wimodal-form-group label {
        color: var(--bg4);
        font-weight: 600;
        font-size: clamp(0.85rem, 1vw, 0.95rem);
        display: flex;
        align-items: center;
        gap: 0.8vh;
      }
      
      .wimodal-form-group label i {
        color: var(--mco);
      }
      
      .wimodal-form-group input,
      .wimodal-form-group textarea {
        width: 100%;
        padding: 1.2vh 1.2vw;
        border: 2px solid var(--bdr);
        border-radius: 1vh;
        outline: none;
        background: rgba(255, 255, 255, 0.8);
        font-size: clamp(0.85rem, 1vw, 0.95rem);
        font-family: var(--ff_pop);
        font-weight: 500;
        color: var(--txe);
        transition: all 0.3s ease;
      }
      
      .wimodal-form-group textarea {
        min-height: 15vh;
        font-family: 'Courier New', monospace;
        resize: vertical;
      }
      
      .wimodal-form-group input:focus,
      .wimodal-form-group textarea:focus {
        border-color: var(--mco);
        box-shadow: 0 0 0 0.4vh var(--bg1);
        background: white;
      }
      
      .wimodal-preview-img {
        width: 100%;
        max-height: 25vh;
        object-fit: cover;
        border-radius: 1vh;
        margin-top: 1vh;
        display: none;
      }
      
      @media (max-width: 768px) {
        .wimodal-container {
          max-width: 90vw;
          padding: 2vh 4vw;
        }
      }
    </style>
  `),l.estilosInyectados=!0}function P(o={}){T();const a={...{titulo:"Modal",contenido:"",icono:"fa-window-maximize",botones:[],cerrarAlClickFuera:!0,onAbrir:null,onCerrar:null},...o},r=e("<div>",{class:"wimodal-overlay"}),t=e("<div>",{class:"wimodal-container"}),m=e(`
    <div class="wimodal-header">
      <h3 class="wimodal-title">
        <i class="fa-solid ${a.icono}"></i>
        ${a.titulo}
      </h3>
      <button class="wimodal-close">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  `),E=e("<div>",{class:"wimodal-body",html:a.contenido}),w=e("<div>",{class:"wimodal-footer"});return a.botones.length>0&&a.botones.forEach(s=>{const S=e("<button>",{class:`wimodal-btn wimodal-btn-${s.tipo||"primary"}`,text:s.texto,click:function(){s.onClick&&s.onClick(),s.cerrarAlClick!==!1&&u()}});w.append(S)}),t.append(m,E),a.botones.length>0&&t.append(w),r.append(t),e("body").append(r),m.find(".wimodal-close").on("click",u),a.cerrarAlClickFuera&&r.on("click",function(s){s.target===this&&u()}),l.overlayActual=r,l.modalActual=t,a.onCerrar&&(l.callbacks.onCerrar=a.onCerrar),setTimeout(()=>{r.addClass("activo"),t.addClass("activo"),e("body").css("overflow","hidden"),a.onAbrir&&a.onAbrir(t)},10),t}function u(){if(!l.overlayActual)return;const o=l.overlayActual,i=l.modalActual;l.callbacks.onCerrar&&(l.callbacks.onCerrar(),l.callbacks.onCerrar=null),o.removeClass("activo"),i.removeClass("activo"),setTimeout(()=>{o.remove(),e("body").css("overflow",""),l.overlayActual=null,l.modalActual=null},300)}function L(o={}){const a={...{titulo:"¿Está seguro?",mensaje:"¿Desea continuar con esta acción?",textoConfirmar:"Confirmar",textoCancelar:"Cancelar",tipo:"warning",onConfirmar:null,onCancelar:null},...o},r={warning:"fa-triangle-exclamation",danger:"fa-circle-xmark",info:"fa-circle-info"},t=`
    <div style="text-align: center; padding: 2vh 0;">
      <p style="font-size: clamp(1rem, 1.2vw, 1.15rem); color: var(--tx); line-height: 1.6;">
        ${a.mensaje}
      </p>
    </div>
  `;return P({titulo:a.titulo,contenido:t,icono:r[a.tipo]||r.warning,cerrarAlClickFuera:!1,botones:[{texto:a.textoCancelar,tipo:"secondary",onClick:a.onCancelar},{texto:a.textoConfirmar,tipo:a.tipo==="danger"?"danger":"primary",onClick:a.onConfirmar}]})}function $(o=null,i=null){const a=o!==null,r=`
    <form id="wimodal-form-proyecto">
      <div class="wimodal-form-grid">
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-signature"></i>
            Nombre del Proyecto
          </label>
          <input type="text" id="wi-nombre" placeholder="Ej: RetoDelMes" required 
                 value="${o?.nombre||""}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-image"></i>
            URL de Imagen del Proyecto
          </label>
          <input type="url" id="wi-imagen" placeholder="https://ejemplo.com/imagen.jpg"
                 value="${o?.imagen||""}">
          <img id="wi-preview" class="wimodal-preview-img" 
               src="${o?.imagen||""}"
               ${o?.imagen?'style="display: block;"':""}>
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-users"></i>
            Link Colaborador
          </label>
          <input type="url" id="wi-colaborador" placeholder="https://ejemplo.com/colaborador"
                 value="${o?.linkColaborador||""}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-user-shield"></i>
            Link de Administración
          </label>
          <input type="url" id="wi-admin" placeholder="https://ejemplo.com/admin"
                 value="${o?.linkAdmin||""}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-sticky-note"></i>
            Notas del Proyecto
          </label>
          <textarea id="wi-notas" placeholder="Escribe tus notas aquí...&#10;- Recordatorios&#10;- Tareas pendientes&#10;- Información importante">${o?.notas||""}</textarea>
        </div>
      </div>
      
      <button type="submit" class="wimodal-btn wimodal-btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 1vh;">
        <i class="fa-solid fa-save"></i>
        ${a?"Actualizar Proyecto":"Guardar Proyecto"}
      </button>
    </form>
  `;P({titulo:a?"Editar Proyecto":"Nuevo Proyecto",contenido:r,icono:a?"fa-edit":"fa-plus-circle",botones:[]}),e("#wi-imagen").on("input",function(){const t=e(this).val();t.trim()?e("#wi-preview").attr("src",t).fadeIn():e("#wi-preview").fadeOut()}),e("#wimodal-form-proyecto").on("submit",function(t){t.preventDefault();const m={id:o?.id||Date.now(),nombre:e("#wi-nombre").val().trim(),imagen:e("#wi-imagen").val()||"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",linkColaborador:e("#wi-colaborador").val(),linkAdmin:e("#wi-admin").val(),notas:e("#wi-notas").val(),fechaCreacion:o?.fechaCreacion||new Date().toISOString()};if(!m.nombre){alert("Por favor ingrese un nombre para el proyecto");return}i&&i(m,a),u()})}let p=!1;const f=async()=>{const o=g("corpProyectos");if(o)return C(o);try{const i=await y(h(c,"proyectos"));if(i.empty)return e("#grillaProyectos").html('<div class="estado-vacio"><i class="fa-solid fa-folder-open"></i><p>No hay proyectos aún</p><span>Haz clic en "Nuevo Proyecto" para comenzar</span></div>');const a=i.docs.map(r=>({id:r.id,...r.data()}));x("corpProyectos",a,24),C(a),n(`✅ ${i.size} proyectos cargados`)}catch(i){console.error(i),e("#grillaProyectos").html('<div class="estado-error"><i class="fa-solid fa-exclamation-triangle"></i><p>Error al cargar</p></div>')}};function C(o){const i=o.sort((a,r)=>(a.orden||0)-(r.orden||0));e("#grillaProyectos").html(i.map(a=>{const r=JSON.stringify(a).replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`
      <div class="tarjeta-proyecto">
        <img src="${a.imagen||"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"}" alt="${a.nombre}" class="imagen-proyecto">
        <div class="contenido-proyecto">
          <div class="encabezado-proyecto">
            <h3 class="nombre-proyecto">${a.nombre}</h3>
            ${p?`<div class="acciones-proyecto"><button class="boton-accion boton-editar" data-proyecto='${r}' title="Editar"><i class="fa-solid fa-edit"></i></button><button class="boton-accion boton-eliminar" data-id="${a.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button></div>`:""}
          </div>
          <div class="enlaces-proyecto">
            ${a.linkColaborador?`<a href="${a.linkColaborador}" target="_blank" class="enlace-proyecto"><i class="fa-solid fa-users"></i><span>Colaborador:</span><span class="url-enlace">${a.linkColaborador}</span></a>`:""}
            ${a.linkAdmin?`<a href="${a.linkAdmin}" target="_blank" class="enlace-proyecto"><i class="fa-solid fa-user-shield"></i><span>Administración:</span><span class="url-enlace">${a.linkAdmin}</span></a>`:""}
          </div>
          ${a.notas?`<div class="etiqueta-notas-proyecto"><i class="fa-solid fa-sticky-note"></i>Notas del Proyecto</div><div class="notas-proyecto">${a.notas.replace(/\n/g,"<br>")}</div>`:""}
        </div>
      </div>
    `}).join(""))}const d=(o,i)=>{const a=o.find("i");i?(o.prop("disabled",!0),a.data("clase",a.attr("class")).attr("class","fa-solid fa-spinner fa-spin")):(o.prop("disabled",!1),a.attr("class",a.data("clase")))};e(document).on("click","#alternarModo",function(){p=!p;const o=e(this),i=o.find("i");p?(o.addClass("modo-edicion"),i.removeClass("fa-eye").addClass("fa-pen-to-square"),o.attr("title","Modo ver"),e("#botonAgregarProyecto").fadeIn()):(o.removeClass("modo-edicion"),i.removeClass("fa-pen-to-square").addClass("fa-eye"),o.attr("title","Modo edición"),e("#botonAgregarProyecto").fadeOut()),f()});e(document).on("click","#botonAgregarProyecto",()=>{$(null,z)});e(document).on("click",".boton-editar",function(){const o=JSON.parse(e(this).attr("data-proyecto").replace(/&quot;/g,'"').replace(/&#39;/g,"'"));$(o,z)});e(document).on("click",".boton-eliminar",function(){const o=String(e(this).data("id"));L({titulo:"¿Eliminar proyecto?",mensaje:"¿Está seguro de eliminar este proyecto? Esta acción no se puede deshacer.",tipo:"danger",textoConfirmar:"Eliminar",onConfirmar:()=>B(o,e(this))})});e(document).on("click",".boton-actualizar",function(){d(e(this),!0),n("Actualizando datos..."),b("corpProyectos"),f().finally(()=>d(e(this),!1))});async function z(o,i,a){const r=g("wiSmile");a&&d(a,!0);try{const t={nombre:o.nombre,imagen:o.imagen,linkColaborador:o.linkColaborador,linkAdmin:o.linkAdmin,notas:o.notas,fechaActualizacion:new Date().toISOString()};i?(t.actualizadoPor=r.usuario,t.actualizadoEmail=r.email,await j(v(c,"proyectos",o.id),t),n("✅ Proyecto actualizado")):(t.creadoPor=r.usuario,t.creadoEmail=r.email,t.fechaCreacion=new Date().toISOString(),t.orden=await R(),await O(v(c,"proyectos",`${N(o.nombre)}_${Date.now()}`),t),n("✅ Proyecto creado")),b("corpProyectos"),f()}catch(t){console.error(t),n("❌ Error al guardar proyecto")}finally{a&&d(a,!1)}}async function R(){try{const o=await y(h(c,"proyectos"));if(o.empty)return 1;const i=o.docs.map(a=>a.data().orden||0);return Math.max(...i)+1}catch(o){return console.error(o),1}}async function B(o,i){i&&d(i,!0);try{await q(v(c,"proyectos",o)),n("✅ Proyecto eliminado"),b("corpProyectos"),f()}catch(a){console.error(a),n("❌ Error al eliminar proyecto")}finally{i&&d(i,!1)}}D(A,async o=>{if(!o)return window.location.href="/";try{const i=g("wiSmile");if(i)return k(i);const r=(await y(M(h(c,"smiles"),_("usuario","==",o.displayName)))).docs[0].data();x("wiSmile",r,450),k(r)}catch(i){console.error(i)}});function k(o){console.log(o.nombre),n("Bienvenido "+o.nombre+"!"),e(".app").html(`
 <!-- ENCABEZADO -->
  <header class="encabezado-superior">
    <div class="contenedor-encabezado">
      <div class="izquierda-encabezado">
        <h1><i class="fa-solid fa-building"></i> Corporación Claudia</h1>
      </div>
      <div class="derecha-encabezado">
        <button class="boton-actualizar" title="Actualizar">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
        <button class="alternar-modo" id="alternarModo" title="Modo edición">
          <i class="fa-solid fa-eye"></i>
        </button>
        <div class="witemas"></div>

        <div class="info-usuario">
          <img src="${o.imagen||"smile.png"}" alt="Usuario" class="avatar-usuario">
          <span>${o.nombre}</span>
        </div>
        <button class="boton-cerrar-sesion bt_salir">
          <i class="fa-solid fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </header>

  <div class="contenedor-principal">
    <!-- ENCABEZADO DE SECCION -->
    <div class="encabezado-seccion">
      <h2 class="titulo-seccion">
        <i class="fa-solid fa-folder-open"></i>
        Proyectos Activos
      </h2>
      <button class="boton-agregar-proyecto" id="botonAgregarProyecto" style="display: none;">
        <i class="fa-solid fa-plus"></i>
        Nuevo Proyecto
      </button>
    </div>

    <!-- GRILLA DE PROYECTOS -->
    <div class="grilla-proyectos" id="grillaProyectos">
      <div class="estado-cargando">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Cargando proyectos...</p>
      </div>
    </div>
  </div>

  <!-- NOTIFICACION TOAST -->
  <div class="toast" id="toast">
    <i class="fa-solid fa-circle-check"></i>
    <span id="mensajeToast">Operación exitosa</span>
  </div>

  <footer class="pie-pagina">
    <p>Creado con <i class="fa-solid fa-heart" style="color: #ff3849;"></i> por 
    <a class="enlace-pie" href="https://wtaype.github.io/" target="_blank">@wilder.taype</a> 2025 - HClaudia</p>
  </footer>

`),f()}e(document).on("click",".bt_salir",async()=>{await I(A),window.location.href="/";try{localStorage.clear()}catch{Object.keys(localStorage).forEach(i=>localStorage.removeItem(i))}});
