import $ from 'jquery';
import { db } from '../firebase/init.js';
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Mensaje, savels, getls, removels, nombrejunto } from '../widev.js';
import { abrirModalProyecto, confirmarModal } from './wimodal.js';

// =============================================
// VARIABLES GLOBALES
// =============================================
let modoEdicion = false;

// =============================================
// CARGAR Y RENDERIZAR PROYECTOS
// =============================================
export const misProyectos = async () => {
  const cache = getls('corpProyectos');
  if(cache) return renderizarProyectos(cache);

  try {
    const busq = await getDocs(collection(db, 'proyectos'));
    if(busq.empty) return $('#grillaProyectos').html(`<div class="estado-vacio"><i class="fa-solid fa-folder-open"></i><p>No hay proyectos aún</p><span>Haz clic en "Nuevo Proyecto" para comenzar</span></div>`);

    const proyectos = busq.docs.map(d => ({id: d.id, ...d.data()}));
    savels('corpProyectos', proyectos, 24);
    renderizarProyectos(proyectos);
    Mensaje(`✅ ${busq.size} proyectos cargados`);
  } catch(e) {
    console.error(e);
    $('#grillaProyectos').html(`<div class="estado-error"><i class="fa-solid fa-exclamation-triangle"></i><p>Error al cargar</p></div>`);
  }
};

// =============================================
// RENDERIZAR PROYECTOS
// =============================================
function renderizarProyectos(proyectos) {
  const ordenados = proyectos.sort((a, b) => (a.orden || 0) - (b.orden || 0)); // ← AGREGAR ESTA LÍNEA
  $('#grillaProyectos').html(ordenados.map(p => { 
    const pJSON = JSON.stringify(p).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return `
      <div class="tarjeta-proyecto">
        <img src="${p.imagen || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'}" alt="${p.nombre}" class="imagen-proyecto">
        <div class="contenido-proyecto">
          <div class="encabezado-proyecto">
            <h3 class="nombre-proyecto">${p.nombre}</h3>
            ${modoEdicion ? `<div class="acciones-proyecto"><button class="boton-accion boton-editar" data-proyecto='${pJSON}' title="Editar"><i class="fa-solid fa-edit"></i></button><button class="boton-accion boton-eliminar" data-id="${p.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button></div>` : ''}
          </div>
          <div class="enlaces-proyecto">
            ${p.linkColaborador ? `<a href="${p.linkColaborador}" target="_blank" class="enlace-proyecto"><i class="fa-solid fa-users"></i><span>Colaborador:</span><span class="url-enlace">${p.linkColaborador}</span></a>` : ''}
            ${p.linkAdmin ? `<a href="${p.linkAdmin}" target="_blank" class="enlace-proyecto"><i class="fa-solid fa-user-shield"></i><span>Administración:</span><span class="url-enlace">${p.linkAdmin}</span></a>` : ''}
          </div>
          ${p.notas ? `<div class="etiqueta-notas-proyecto"><i class="fa-solid fa-sticky-note"></i>Notas del Proyecto</div><div class="notas-proyecto">${p.notas.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
      </div>
    `;
  }).join(''));
}

// =============================================
// SPIN HELPER
// =============================================
const spin = ($btn, estado) => {
  const $icono = $btn.find('i');
  if(estado) {
    $btn.prop('disabled', true);
    $icono.data('clase', $icono.attr('class')).attr('class', 'fa-solid fa-spinner fa-spin');
  } else {
    $btn.prop('disabled', false);
    $icono.attr('class', $icono.data('clase'));
  }
};

// =============================================
// EVENTOS DELEGADOS
// =============================================
$(document).on('click', '#alternarModo', function() {
  modoEdicion = !modoEdicion;
  const $btn = $(this), $icono = $btn.find('i');
  
  if(modoEdicion) {
    $btn.addClass('modo-edicion');
    $icono.removeClass('fa-eye').addClass('fa-pen-to-square');
    $btn.attr('title', 'Modo ver');
    $('#botonAgregarProyecto').fadeIn();
  } else {
    $btn.removeClass('modo-edicion');
    $icono.removeClass('fa-pen-to-square').addClass('fa-eye');
    $btn.attr('title', 'Modo edición');
    $('#botonAgregarProyecto').fadeOut();
  }
  
  misProyectos();
});

$(document).on('click', '#botonAgregarProyecto', () => {
  abrirModalProyecto(null, guardarProyecto);
});

$(document).on('click', '.boton-editar', function() {
  const proyecto = JSON.parse($(this).attr('data-proyecto').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
  abrirModalProyecto(proyecto, guardarProyecto);
});

$(document).on('click', '.boton-eliminar', function() {
  const id = String($(this).data('id'));
    confirmarModal({
      titulo: '¿Eliminar proyecto?',
      mensaje: '¿Está seguro de eliminar este proyecto? Esta acción no se puede deshacer.',
      tipo: 'danger',
      textoConfirmar: 'Eliminar',
      onConfirmar: () => eliminarProyecto(id, $(this))
    });
});

$(document).on('click', '.boton-actualizar', function() {
  spin($(this), true);
  Mensaje('Actualizando datos...');
  removels('corpProyectos');
  misProyectos().finally(() => spin($(this), false));
});

// =============================================
// GUARDAR PROYECTO
// =============================================
async function guardarProyecto(datos, esEdicion, $btn) {
  const wi = getls('wiSmile');
  if($btn) spin($btn, true);

  try {
    const proyecto = {
      nombre: datos.nombre,
      imagen: datos.imagen,
      linkColaborador: datos.linkColaborador,
      linkAdmin: datos.linkAdmin,
      notas: datos.notas,
      fechaActualizacion: new Date().toISOString(),
      
    };

    if(esEdicion) {
      proyecto.actualizadoPor = wi.usuario;
      proyecto.actualizadoEmail = wi.email;
      await updateDoc(doc(db, 'proyectos', datos.id), proyecto);
      Mensaje('✅ Proyecto actualizado');
    } else {
      proyecto.creadoPor = wi.usuario;
      proyecto.creadoEmail = wi.email;
      proyecto.fechaCreacion = new Date().toISOString();
      proyecto.orden = await obtenerSiguienteOrden(); // ← AGREGAR ESTA LÍNEA
      await setDoc(doc(db, 'proyectos', `${nombrejunto(datos.nombre)}_${Date.now()}`), proyecto);
      Mensaje('✅ Proyecto creado');
    }
    
    removels('corpProyectos');
    misProyectos();
  } catch(e) {
    console.error(e);
    Mensaje('❌ Error al guardar proyecto');
  } finally {
    if($btn) spin($btn, false);
  }
}
// =============================================
// OBTENER SIGUIENTE ORDEN
// =============================================
async function obtenerSiguienteOrden() {
  try {
    const busq = await getDocs(collection(db, 'proyectos'));
    if(busq.empty) return 1;
    
    const ordenes = busq.docs.map(d => d.data().orden || 0);
    return Math.max(...ordenes) + 1;
  } catch(e) {
    console.error(e);
    return 1;
  }
}

// =============================================
// ELIMINAR PROYECTO
// =============================================
async function eliminarProyecto(id, $btn) {
  if($btn) spin($btn, true);

  try {
    await deleteDoc(doc(db, 'proyectos', id));
    Mensaje('✅ Proyecto eliminado');
    removels('corpProyectos');
    misProyectos();
  } catch(e) {
    console.error(e);
    Mensaje('❌ Error al eliminar proyecto');
  } finally {
    if($btn) spin($btn, false);
  }
}