import{$ as t,t as u,b as h,c as w,a as l,l as C,M as s,v as G,d as v,i as N,x as T,y as g,z as _,A as L,B,C as A,q as R,e as U,h as j}from"./widev-BIQH08G2.js";const n={overlayActual:null,modalActual:null,callbacks:{},estilosInyectados:!1};function V(){if(n.estilosInyectados)return;t("head").append(`
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
  `),n.estilosInyectados=!0}function S(a={}){V();const o={...{titulo:"Modal",contenido:"",icono:"fa-window-maximize",botones:[],cerrarAlClickFuera:!0,onAbrir:null,onCerrar:null},...a},i=t("<div>",{class:"wimodal-overlay"}),r=t("<div>",{class:"wimodal-container"}),d=t(`
    <div class="wimodal-header">
      <h3 class="wimodal-title">
        <i class="fa-solid ${o.icono}"></i>
        ${o.titulo}
      </h3>
      <button class="wimodal-close">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  `),M=t("<div>",{class:"wimodal-body",html:o.contenido}),x=t("<div>",{class:"wimodal-footer"});return o.botones.length>0&&o.botones.forEach(c=>{const O=t("<button>",{class:`wimodal-btn wimodal-btn-${c.tipo||"primary"}`,text:c.texto,click:function(){c.onClick&&c.onClick(),c.cerrarAlClick!==!1&&f()}});x.append(O)}),r.append(d,M),o.botones.length>0&&r.append(x),i.append(r),t("body").append(i),d.find(".wimodal-close").on("click",f),o.cerrarAlClickFuera&&i.on("click",function(c){c.target===this&&f()}),n.overlayActual=i,n.modalActual=r,o.onCerrar&&(n.callbacks.onCerrar=o.onCerrar),setTimeout(()=>{i.addClass("activo"),r.addClass("activo"),t("body").css("overflow","hidden"),o.onAbrir&&o.onAbrir(r)},10),r}function f(){if(!n.overlayActual)return;const a=n.overlayActual,e=n.modalActual;n.callbacks.onCerrar&&(n.callbacks.onCerrar(),n.callbacks.onCerrar=null),a.removeClass("activo"),e.removeClass("activo"),setTimeout(()=>{a.remove(),t("body").css("overflow",""),n.overlayActual=null,n.modalActual=null},300)}function F(a={}){const o={...{titulo:"¿Está seguro?",mensaje:"¿Desea continuar con esta acción?",textoConfirmar:"Confirmar",textoCancelar:"Cancelar",tipo:"warning",onConfirmar:null,onCancelar:null},...a},i={warning:"fa-triangle-exclamation",danger:"fa-circle-xmark",info:"fa-circle-info"},r=`
    <div style="text-align: center; padding: 2vh 0;">
      <p style="font-size: clamp(1rem, 1.2vw, 1.15rem); color: var(--tx); line-height: 1.6;">
        ${o.mensaje}
      </p>
    </div>
  `;return S({titulo:o.titulo,contenido:r,icono:i[o.tipo]||i.warning,cerrarAlClickFuera:!1,botones:[{texto:o.textoCancelar,tipo:"secondary",onClick:o.onCancelar},{texto:o.textoConfirmar,tipo:o.tipo==="danger"?"danger":"primary",onClick:o.onConfirmar}]})}function q(a=null,e=null){const o=a!==null,i=`
    <form id="wimodal-form-proyecto">
      <div class="wimodal-form-grid">
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-signature"></i>
            Nombre del Proyecto
          </label>
          <input type="text" id="wi-nombre" placeholder="Ej: RetoDelMes" required 
                 value="${a?.nombre||""}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-image"></i>
            URL de Imagen del Proyecto
          </label>
          <input type="url" id="wi-imagen" placeholder="https://ejemplo.com/imagen.jpg"
                 value="${a?.imagen||""}">
          <img id="wi-preview" class="wimodal-preview-img" 
               src="${a?.imagen||""}"
               ${a?.imagen?'style="display: block;"':""}>
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-users"></i>
            Link Colaborador
          </label>
          <input type="url" id="wi-colaborador" placeholder="https://ejemplo.com/colaborador"
                 value="${a?.linkColaborador||""}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-user-shield"></i>
            Link de Administración
          </label>
          <input type="url" id="wi-admin" placeholder="https://ejemplo.com/admin"
                 value="${a?.linkAdmin||""}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-sticky-note"></i>
            Notas del Proyecto
          </label>
          <textarea id="wi-notas" placeholder="Escribe tus notas aquí...&#10;- Recordatorios&#10;- Tareas pendientes&#10;- Información importante">${a?.notas||""}</textarea>
        </div>
      </div>
      
      <button type="submit" class="wimodal-btn wimodal-btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 1vh;">
        <i class="fa-solid fa-save"></i>
        ${o?"Actualizar Proyecto":"Guardar Proyecto"}
      </button>
    </form>
  `;S({titulo:o?"Editar Proyecto":"Nuevo Proyecto",contenido:i,icono:o?"fa-edit":"fa-plus-circle",botones:[]}),t("#wi-imagen").on("input",function(){const r=t(this).val();r.trim()?t("#wi-preview").attr("src",r).fadeIn():t("#wi-preview").fadeOut()}),t("#wimodal-form-proyecto").on("submit",function(r){r.preventDefault();const d={id:a?.id||Date.now(),nombre:t("#wi-nombre").val().trim(),imagen:t("#wi-imagen").val()||"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",linkColaborador:t("#wi-colaborador").val(),linkAdmin:t("#wi-admin").val(),notas:t("#wi-notas").val(),fechaCreacion:a?.fechaCreacion||new Date().toISOString()};if(!d.nombre){alert("Por favor ingrese un nombre para el proyecto");return}e&&e(d,o),f()})}let b=!1;const m=async()=>{const a=u("corpProyectos");if(a)return P(a);try{const e=await h(w(l,"proyectos"));if(e.empty)return t("#grillaProyectos").html('<div class="estado-vacio"><i class="fa-solid fa-folder-open"></i><p>No hay proyectos aún</p><span>Haz clic en "Nuevo Proyecto" para comenzar</span></div>');const o=e.docs.map(i=>({id:i.id,...i.data()}));C("corpProyectos",o,24),P(o),s(`✅ ${e.size} proyectos cargados`)}catch(e){console.error(e),t("#grillaProyectos").html('<div class="estado-error"><i class="fa-solid fa-exclamation-triangle"></i><p>Error al cargar</p></div>')}};function P(a){const e=a.sort((o,i)=>(o.orden||0)-(i.orden||0));t("#grillaProyectos").html(e.map(o=>{const i=JSON.stringify(o).replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`
      <div class="tarjeta-proyecto">
        <img src="${o.imagen||"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"}" alt="${o.nombre}" class="imagen-proyecto">
        <div class="contenido-proyecto">
          <div class="encabezado-proyecto">
            <h3 class="nombre-proyecto">${o.nombre}</h3>
            ${b?`<div class="acciones-proyecto"><button class="boton-accion boton-editar" data-proyecto='${i}' title="Editar"><i class="fa-solid fa-edit"></i></button><button class="boton-accion boton-eliminar" data-id="${o.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button></div>`:""}
          </div>
          <div class="enlaces-proyecto">
            ${o.linkColaborador?`<a href="${o.linkColaborador}" target="_blank" class="enlace-proyecto"><i class="fa-solid fa-users"></i><span>Smile:</span><span class="url-enlace">${o.linkColaborador}</span></a>`:""}
            ${o.linkAdmin?`<a href="${o.linkAdmin}" target="_blank" class="enlace-proyecto"><i class="fa-solid fa-user-shield"></i><span>Admin:</span><span class="url-enlace">${o.linkAdmin}</span></a>`:""}
          </div>
          ${o.notas?`<div class="etiqueta-notas-proyecto"><i class="fa-solid fa-sticky-note"></i>Notas del Proyecto</div><div class="notas-proyecto">${o.notas.replace(/\n/g,"<br>")}</div>`:""}
        </div>
      </div>
    `}).join(""))}const y=(a,e)=>{const o=a.find("i");e?(a.prop("disabled",!0),o.data("clase",o.attr("class")).attr("class","fa-solid fa-spinner fa-spin")):(a.prop("disabled",!1),o.attr("class",o.data("clase")))};t(document).on("click","#alternarModo",function(){b=!b;const a=t(this),e=a.find("i");b?(a.addClass("modo-edicion"),e.removeClass("fa-eye").addClass("fa-pen-to-square"),a.attr("title","Modo ver"),t("#botonAgregarProyecto").fadeIn()):(a.removeClass("modo-edicion"),e.removeClass("fa-pen-to-square").addClass("fa-eye"),a.attr("title","Modo edición"),t("#botonAgregarProyecto").fadeOut()),m()});t(document).on("click","#botonAgregarProyecto",()=>{q(null,D)});t(document).on("click",".boton-editar",function(){const a=JSON.parse(t(this).attr("data-proyecto").replace(/&quot;/g,'"').replace(/&#39;/g,"'"));q(a,D)});t(document).on("click",".boton-eliminar",function(){const a=String(t(this).data("id"));F({titulo:"¿Eliminar proyecto?",mensaje:"¿Está seguro de eliminar este proyecto? Esta acción no se puede deshacer.",tipo:"danger",textoConfirmar:"Eliminar",onConfirmar:()=>Y(a,t(this))})});async function D(a,e,o){const i=u("wiSmile");o&&y(o,!0);try{const r={nombre:a.nombre,imagen:a.imagen,linkColaborador:a.linkColaborador,linkAdmin:a.linkAdmin,notas:a.notas,fechaActualizacion:new Date().toISOString()};e?(r.actualizadoPor=i.usuario,r.actualizadoEmail=i.email,await G(v(l,"proyectos",a.id),r),s("✅ Proyecto actualizado")):(r.creadoPor=i.usuario,r.creadoEmail=i.email,r.fechaCreacion=new Date().toISOString(),r.orden=await J(),await N(v(l,"proyectos",`${T(a.nombre)}_${Date.now()}`),r),s("✅ Proyecto creado")),g("corpProyectos"),m()}catch(r){console.error(r),s("❌ Error al guardar proyecto")}finally{o&&y(o,!1)}}async function J(){try{const a=await h(w(l,"proyectos"));if(a.empty)return 1;const e=a.docs.map(o=>o.data().orden||0);return Math.max(...e)+1}catch(a){return console.error(a),1}}async function Y(a,e){e&&y(e,!0);try{await _(v(l,"proyectos",a)),s("✅ Proyecto eliminado"),g("corpProyectos"),m()}catch(o){console.error(o),s("❌ Error al eliminar proyecto")}finally{e&&y(e,!1)}}t(document).on("keyup","#buscadorProyectos",function(){const a=t(this).val().toLowerCase();t(".tarjeta-proyecto").each(function(){const e=t(this).find(".nombre-proyecto").text().toLowerCase();t(this).toggle(e.includes(a))})});const I=async()=>{const a=u("corpNotas");if(a)return p(a);try{const e=await h(w(l,"notas"));if(e.empty)return p("<p><strong>Bienvenido al Notepad General</strong></p><p>Aquí puedes escribir notas importantes.</p>");const o=e.docs[0].data();C("corpNotas",o.contenido,1),p(o.contenido)}catch(e){console.error(e),p("<p>Error al cargar notas</p>")}};function p(a){t("#notepadContent").html(a)}const z=(a,e)=>{const o=a.find("i");e?(a.prop("disabled",!0),o.data("clase",o.attr("class")).attr("class","fa-solid fa-spinner fa-spin")):(a.prop("disabled",!1),o.attr("class",o.data("clase")))},H=async()=>{const a=u("wiSmile"),e=t("#notepadContent").html(),o=t("#btnGuardar");z(o,!0);try{const i={contenido:e,actualizadoPor:a.usuario,actualizadoEmail:a.email,fechaActualizacion:new Date().toISOString()};await N(v(l,"notas","nota_general"),i),C("corpNotas",e,1),s("✅ Notas guardadas"),t("#notepadContent").attr("contenteditable","false"),t("#notepadToolbar").removeClass("visible"),t(".btn-notepad").removeClass("activo"),t("#btnVer").addClass("activo"),t("#btnGuardar").hide()}catch(i){console.error(i),s("❌ Error al guardar notas")}finally{z(o,!1)}};t(document).on("click","#btnVer",function(){t("#notepadContent").attr("contenteditable","false"),t("#notepadToolbar").removeClass("visible"),t(".btn-notepad").removeClass("activo"),t(this).addClass("activo"),t("#btnGuardar").hide()});t(document).on("click","#btnEditar",function(){t("#notepadContent").attr("contenteditable","true").focus(),t("#notepadToolbar").addClass("visible"),t(".btn-notepad").removeClass("activo"),t(this).addClass("activo"),t("#btnGuardar").show()});t(document).on("click","#btnGuardar",H);t(document).on("click",".toolbar-btn",function(a){a.preventDefault();const e=t(this).data("cmd");if(e==="createLink"){const o=prompt("Ingrese URL:","https://");o&&o!=="https://"&&document.execCommand(e,!1,o)}else document.execCommand(e,!1,null);t(this).toggleClass("active")});const $=(a,e)=>{const o=a.find("i");e?(a.prop("disabled",!0),o.data("clase",o.attr("class")).attr("class","fa-solid fa-spinner fa-spin")):(a.prop("disabled",!1),o.attr("class",o.data("clase")))},W=async a=>{$(a,!0),s("Actualizando datos..."),g("corpProyectos"),g("corpNotas"),await Promise.all([m(),I()]),$(a,!1),s("✅ Datos actualizados")};t(document).on("click",".boton-actualizar",function(){W(t(this))});let k=null;L(j,async a=>{if(!a)return window.location.href="/";k=a;try{const e=u("wiSmile");if(e)return E(e),A(l,k);const i=(await h(R(w(l,"smiles"),U("usuario","==",a.displayName)))).docs[0].data();C("wiSmile",i,450),E(i),A(l,k)}catch(e){console.error(e)}});function E(a){console.log(a.nombre),s("Bienvenido "+a.nombre+"!"),t(".app").html(`
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
          <img src="${a.imagen||"smile.png"}" alt="Usuario" class="avatar-usuario">
          <span>${a.nombre}</span>
        </div>
        <button class="boton-cerrar-sesion bt_salir">
          <i class="fa-solid fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </header>

  <div class="contenedor-principal">
<div class="seccion-proyectos">
<div class="buscador-contenedor">
<input type="text" class="buscador-input" id="buscadorProyectos" placeholder="Buscar proyectos por nombre...">
<i class="fa-solid fa-search buscador-icono"></i>
</div>
<div class="encabezado-seccion">
<h2 class="titulo-seccion"><i class="fa-solid fa-folder-open"></i> Proyectos Activos</h2>
<button class="boton-agregar-proyecto" id="botonAgregarProyecto" style="display:none"><i class="fa-solid fa-plus"></i> Nuevo Proyecto</button>
</div>
<div class="grilla-proyectos" id="grillaProyectos">
<div class="estado-cargando">
<i class="fa-solid fa-spinner fa-spin"></i>
<p>Cargando proyectos...</p>
</div>
</div>
</div>

<div class="seccion-notepad">
<div class="notepad-card">
<div class="notepad-header">
<h3 class="notepad-titulo"><i class="fa-solid fa-note-sticky"></i> Notepad General</h3>
<div class="notepad-acciones">
<button class="btn-notepad" id="btnVer"><i class="fa-solid fa-eye"></i> Ver</button>
<button class="btn-notepad" id="btnEditar"><i class="fa-solid fa-pen"></i> Editar</button>
<button class="btn-notepad" id="btnGuardar" style="display:none"><i class="fa-solid fa-save"></i> Guardar</button>
</div>
</div>
<div class="notepad-toolbar" id="notepadToolbar">
<button class="toolbar-btn" data-cmd="bold" title="Negrita"><i class="fa-solid fa-bold"></i></button>
<button class="toolbar-btn" data-cmd="italic" title="Cursiva"><i class="fa-solid fa-italic"></i></button>
<button class="toolbar-btn" data-cmd="underline" title="Subrayado"><i class="fa-solid fa-underline"></i></button>
<button class="toolbar-btn" data-cmd="justifyLeft" title="Izquierda"><i class="fa-solid fa-align-left"></i></button>
<button class="toolbar-btn" data-cmd="justifyCenter" title="Centro"><i class="fa-solid fa-align-center"></i></button>
<button class="toolbar-btn" data-cmd="justifyRight" title="Derecha"><i class="fa-solid fa-align-right"></i></button>
<button class="toolbar-btn" data-cmd="createLink" title="Enlace"><i class="fa-solid fa-link"></i></button>
</div>
<div class="notepad-content" id="notepadContent" contenteditable="false">
<p><strong>Bienvenido al Notepad General</strong></p>
<p>Aquí puedes escribir notas importantes, recordatorios o cualquier información que necesites guardar.</p>
<p style="text-align:center">🎯 Usa el botón <strong>Editar</strong> para comenzar</p>
</div>
</div>
</div>
</div>

<div class="toast" id="toast">
<i class="fa-solid fa-circle-check"></i>
<span id="mensajeToast">Operación exitosa</span>
</div>

<footer class="pie-pagina">
<p>Creado con <i class="fa-solid fa-heart" style="color:#ec4899"></i> por 
<a class="enlace-pie" href="https://wtaype.github.io/" target="_blank">@wilder.taype</a> 2025 - HClaudia</p>
</footer>

`),m(),I()}t(document).on("click",".bt_salir",async()=>{await B(j),window.location.href="/";try{localStorage.clear()}catch{Object.keys(localStorage).forEach(e=>localStorage.removeItem(e))}});
