import $ from 'jquery';
import { db } from '../firebase/init.js';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { Mensaje, savels, getls, removels, nombrejunto } from '../widev.js';

// =============================================
// CARGAR Y MOSTRAR NOTAS
// =============================================
export const misNotas = async () => {
  const cache = getls('corpNotas');
  if(cache) return cargarNotepad(cache);

  try {
    const busq = await getDocs(collection(db, 'notas'));
    if(busq.empty) return cargarNotepad('<p><strong>Bienvenido al Notepad General</strong></p><p>Aquí puedes escribir notas importantes.</p>');

    const nota = busq.docs[0].data();
    savels('corpNotas', nota.contenido, 1);
    cargarNotepad(nota.contenido);
  } catch(e) {
    console.error(e);
    cargarNotepad('<p>Error al cargar notas</p>');
  }
};

// =============================================
// CARGAR NOTEPAD
// =============================================
function cargarNotepad(contenido) {
  $('#notepadContent').html(contenido);
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
// GUARDAR NOTAS
// =============================================
export const guardarNotas = async () => {
  const wi = getls('wiSmile');
  const contenido = $('#notepadContent').html();
  const $btn = $('#btnGuardar');
  
  spin($btn, true); // ← AGREGAR

  try {
    const nota = {
      contenido,
      actualizadoPor: wi.usuario,
      actualizadoEmail: wi.email,
      fechaActualizacion: new Date().toISOString()
    };

    const notaId = 'nota_general';
    await setDoc(doc(db, 'notas', notaId), nota);
    
    savels('corpNotas', contenido, 1);
    Mensaje('✅ Notas guardadas');
    
    $('#notepadContent').attr('contenteditable', 'false');
    $('#notepadToolbar').removeClass('visible');
    $('.btn-notepad').removeClass('activo');
    $('#btnVer').addClass('activo');
    $('#btnGuardar').hide();
  } catch(e) {
    console.error(e);
    Mensaje('❌ Error al guardar notas');
  } finally {
    spin($btn, false); // ← AGREGAR
  }
};

// =============================================
// EVENTOS NOTEPAD
// =============================================
$(document).on('click', '#btnVer', function() {
  $('#notepadContent').attr('contenteditable', 'false');
  $('#notepadToolbar').removeClass('visible');
  $('.btn-notepad').removeClass('activo');
  $(this).addClass('activo');
  $('#btnGuardar').hide();
});

$(document).on('click', '#btnEditar', function() {
  $('#notepadContent').attr('contenteditable', 'true').focus();
  $('#notepadToolbar').addClass('visible');
  $('.btn-notepad').removeClass('activo');
  $(this).addClass('activo');
  $('#btnGuardar').show();
});

$(document).on('click', '#btnGuardar', guardarNotas);

$(document).on('click', '.toolbar-btn', function(e) {
  e.preventDefault();
  const cmd = $(this).data('cmd');
  
  if(cmd === 'createLink') {
    const url = prompt('Ingrese URL:', 'https://');
    if(url && url !== 'https://') document.execCommand(cmd, false, url);
  } else {
    document.execCommand(cmd, false, null);
  }
  
  $(this).toggleClass('active');
});