import './smile.css';
import $ from 'jquery';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { auth, db } from '../firebase/init.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { wiTema, Mensaje, Notificacion, savels, getls, removels, showLoading } from '../widev.js';
import { misProyectos } from './smileb.js';

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

`);

misProyectos(); 

}

// CERRAR SESSIÓN
$(document).on('click', '.bt_salir', async () => {
  await signOut(auth); window.location.href = '/';   // Cierra la sesión + Envia al inicio 
  try{localStorage.clear();}catch(_){Object.keys(localStorage).forEach(k=>localStorage.removeItem(k));} //Limpieza de localStorage
});

