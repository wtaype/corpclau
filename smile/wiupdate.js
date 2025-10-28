import $ from 'jquery';
import { Mensaje, removels } from '../widev.js';
import { misProyectos } from './smileb.js';
import { misNotas } from './smilen.js';

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
// ACTUALIZAR TODO
// =============================================
export const actualizarTodo = async ($btn) => {
  spin($btn, true);
  Mensaje('Actualizando datos...');
  
  removels('corpProyectos');
  removels('corpNotas');
  
  await Promise.all([misProyectos(), misNotas()]);
  
  spin($btn, false);
  Mensaje('✅ Datos actualizados');
};

// =============================================
// EVENTO ACTUALIZAR
// =============================================
$(document).on('click', '.boton-actualizar', function() {
  actualizarTodo($(this));
});