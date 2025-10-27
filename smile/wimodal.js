import $ from 'jquery';
/**
 * WiModal - Sistema de Modales con jQuery
 * @author Wilder Taype
 * @version 3.0
 */

// =============================================
// ESTADO GLOBAL
// =============================================
const WiModal = {
  overlayActual: null,
  modalActual: null,
  callbacks: {},
  estilosInyectados: false
};

// =============================================
// INYECTAR ESTILOS CSS
// =============================================
function inyectarEstilos() {
  if (WiModal.estilosInyectados) return;
  
  const estilos = `
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
  `;
  
  $('head').append(estilos);
  WiModal.estilosInyectados = true;
}

// =============================================
// ABRIR MODAL
// =============================================
function abrirModal(opciones = {}) {
  inyectarEstilos();
  
  const defaults = {
    titulo: 'Modal',
    contenido: '',
    icono: 'fa-window-maximize',
    botones: [],
    cerrarAlClickFuera: true,
    onAbrir: null,
    onCerrar: null
  };
  
  const config = { ...defaults, ...opciones };
  
  // Crear overlay
  const $overlay = $('<div>', { class: 'wimodal-overlay' });
  
  // Crear modal
  const $modal = $('<div>', { class: 'wimodal-container' });
  
  // Header
  const $header = $(`
    <div class="wimodal-header">
      <h3 class="wimodal-title">
        <i class="fa-solid ${config.icono}"></i>
        ${config.titulo}
      </h3>
      <button class="wimodal-close">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  `);
  
  // Body
  const $body = $('<div>', { 
    class: 'wimodal-body',
    html: config.contenido 
  });
  
  // Footer (botones)
  const $footer = $('<div>', { class: 'wimodal-footer' });
  
  if (config.botones.length > 0) {
    config.botones.forEach(btn => {
      const $btn = $('<button>', {
        class: `wimodal-btn wimodal-btn-${btn.tipo || 'primary'}`,
        text: btn.texto,
        click: function() {
          if (btn.onClick) btn.onClick();
          if (btn.cerrarAlClick !== false) cerrarModal();
        }
      });
      $footer.append($btn);
    });
  }
  
  // Ensamblar
  $modal.append($header, $body);
  if (config.botones.length > 0) {
    $modal.append($footer);
  }
  $overlay.append($modal);
  $('body').append($overlay);
  
  // Eventos
  $header.find('.wimodal-close').on('click', cerrarModal);
  
  if (config.cerrarAlClickFuera) {
    $overlay.on('click', function(e) {
      if (e.target === this) cerrarModal();
    });
  }
  
  // Guardar referencias
  WiModal.overlayActual = $overlay;
  WiModal.modalActual = $modal;
  if (config.onCerrar) WiModal.callbacks.onCerrar = config.onCerrar;
  
  // Mostrar con animación
  setTimeout(() => {
    $overlay.addClass('activo');
    $modal.addClass('activo');
    $('body').css('overflow', 'hidden');
    if (config.onAbrir) config.onAbrir($modal);
  }, 10);
  
  return $modal;
}

// =============================================
// CERRAR MODAL
// =============================================
function cerrarModal() {
  if (!WiModal.overlayActual) return;
  
  const $overlay = WiModal.overlayActual;
  const $modal = WiModal.modalActual;
  
  // Callback de cierre
  if (WiModal.callbacks.onCerrar) {
    WiModal.callbacks.onCerrar();
    WiModal.callbacks.onCerrar = null;
  }
  
  // Animar salida
  $overlay.removeClass('activo');
  $modal.removeClass('activo');
  
  setTimeout(() => {
    $overlay.remove();
    $('body').css('overflow', '');
    WiModal.overlayActual = null;
    WiModal.modalActual = null;
  }, 300);
}

// =============================================
// MODAL DE CONFIRMACIÓN
// =============================================
function confirmarModal(opciones = {}) {
  const defaults = {
    titulo: '¿Está seguro?',
    mensaje: '¿Desea continuar con esta acción?',
    textoConfirmar: 'Confirmar',
    textoCancelar: 'Cancelar',
    tipo: 'warning',
    onConfirmar: null,
    onCancelar: null
  };
  
  const config = { ...defaults, ...opciones };
  
  const iconos = {
    warning: 'fa-triangle-exclamation',
    danger: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };
  
  const contenido = `
    <div style="text-align: center; padding: 2vh 0;">
      <p style="font-size: clamp(1rem, 1.2vw, 1.15rem); color: var(--tx); line-height: 1.6;">
        ${config.mensaje}
      </p>
    </div>
  `;
  
  return abrirModal({
    titulo: config.titulo,
    contenido: contenido,
    icono: iconos[config.tipo] || iconos.warning,
    cerrarAlClickFuera: false,
    botones: [
      {
        texto: config.textoCancelar,
        tipo: 'secondary',
        onClick: config.onCancelar
      },
      {
        texto: config.textoConfirmar,
        tipo: config.tipo === 'danger' ? 'danger' : 'primary',
        onClick: config.onConfirmar
      }
    ]
  });
}

// =============================================
// MODAL DE PROYECTO (FORMULARIO)
// =============================================
function abrirModalProyecto(proyecto = null, onGuardar = null) {
  const esEdicion = proyecto !== null;
  
  const contenido = `
    <form id="wimodal-form-proyecto">
      <div class="wimodal-form-grid">
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-signature"></i>
            Nombre del Proyecto
          </label>
          <input type="text" id="wi-nombre" placeholder="Ej: RetoDelMes" required 
                 value="${proyecto?.nombre || ''}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-image"></i>
            URL de Imagen del Proyecto
          </label>
          <input type="url" id="wi-imagen" placeholder="https://ejemplo.com/imagen.jpg"
                 value="${proyecto?.imagen || ''}">
          <img id="wi-preview" class="wimodal-preview-img" 
               src="${proyecto?.imagen || ''}"
               ${proyecto?.imagen ? 'style="display: block;"' : ''}>
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-users"></i>
            Link Colaborador
          </label>
          <input type="url" id="wi-colaborador" placeholder="https://ejemplo.com/colaborador"
                 value="${proyecto?.linkColaborador || ''}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-user-shield"></i>
            Link de Administración
          </label>
          <input type="url" id="wi-admin" placeholder="https://ejemplo.com/admin"
                 value="${proyecto?.linkAdmin || ''}">
        </div>
        
        <div class="wimodal-form-group">
          <label>
            <i class="fa-solid fa-sticky-note"></i>
            Notas del Proyecto
          </label>
          <textarea id="wi-notas" placeholder="Escribe tus notas aquí...&#10;- Recordatorios&#10;- Tareas pendientes&#10;- Información importante">${proyecto?.notas || ''}</textarea>
        </div>
      </div>
      
      <button type="submit" class="wimodal-btn wimodal-btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 1vh;">
        <i class="fa-solid fa-save"></i>
        ${esEdicion ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
      </button>
    </form>
  `;
  
  const $modal = abrirModal({
    titulo: esEdicion ? 'Editar Proyecto' : 'Nuevo Proyecto',
    contenido: contenido,
    icono: esEdicion ? 'fa-edit' : 'fa-plus-circle',
    botones: []
  });
  
  // Preview de imagen
  $('#wi-imagen').on('input', function() {
    const url = $(this).val();
    if (url.trim()) {
      $('#wi-preview').attr('src', url).fadeIn();
    } else {
      $('#wi-preview').fadeOut();
    }
  });
  
  // Submit del formulario
  $('#wimodal-form-proyecto').on('submit', function(e) {
    e.preventDefault();
    
    const datos = {
      id: proyecto?.id || Date.now(),
      nombre: $('#wi-nombre').val().trim(),
      imagen: $('#wi-imagen').val() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      linkColaborador: $('#wi-colaborador').val(),
      linkAdmin: $('#wi-admin').val(),
      notas: $('#wi-notas').val(),
      fechaCreacion: proyecto?.fechaCreacion || new Date().toISOString()
    };
    
    if (!datos.nombre) {
      alert('Por favor ingrese un nombre para el proyecto');
      return;
    }
    
    if (onGuardar) onGuardar(datos, esEdicion);
    cerrarModal();
  });
}

// =============================================
// EXPORTAR
// =============================================
export { abrirModal, cerrarModal, confirmarModal, abrirModalProyecto };