import './smile.css';
import './wiupdate.js'; //Actualizar
import $ from 'jquery';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { auth, db } from '../firebase/init.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { wiTema, Mensaje, Notificacion, savels, getls, removels, showLoading } from '../widev.js';
import { misProyectos } from './smileb.js';
import { misNotas } from './smilen.js';

let wiUsuario = null; //Para guardar usuario
onAuthStateChanged(auth, async user => {
  if(!user) return window.location.href = '/'; // Seguridad default 
  wiUsuario = user; //Guardando usuario

  try{
    const wi = getls('wiSmile');
    if(wi) return smileContenido(wi); // Primero Cache  

    const busq = await getDocs(query(collection(db, 'smiles'), where('usuario', '==', user.displayName)));
    const widt = busq.docs[0].data(); savels('wiSmile', widt, 450); smileContenido(widt); // Luego Firestore  
  }catch(e){console.error(e)}
});


function smileContenido(wi){
    console.log(wi.nombre); 
    Mensaje('Bienvenido ' + wi.nombre + '!');

    // HTML CONTENIDO [Start] 
$('.app').html(`
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
          <img src="${ wi.imagen || 'smile.png'}" alt="Usuario" class="avatar-usuario">
          <span>${wi.nombre}</span>
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

`);

misProyectos(); 
misNotas();


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



}

// CERRAR SESSIÓN
$(document).on('click', '.bt_salir', async () => {
  await signOut(auth); window.location.href = '/';   // Cierra la sesión + Envia al inicio 
  try{localStorage.clear();}catch(_){Object.keys(localStorage).forEach(k=>localStorage.removeItem(k));} //Limpieza de localStorage
});

