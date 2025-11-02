import $ from 'jquery';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { auth, db } from './firebase/init.js'; // Importa la configuración de Firebase desde tu archivo de inicialización
import { getFirestore, setDoc, getDoc, deleteDoc, onSnapshot, doc, collection, getDocs, serverTimestamp, query, where, orderBy, limit } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { Capi, Mensaje, Notificacion, savels, getls, removels, accederRol, showLoading, witip, fechaLocal, calcularEdad } from './widev.js'; //Tools geniales 

// =====================================================
// # PARA INTERACCIÓN GENERAL
// ====================================================
$('.toggle-password').click(function(e) {
    e.preventDefault();
    const $this = $(this),
        target = $this.data('target'),
        $input = $('#' + target),
        $icon = $this.find('i');

    $input.attr('type', (i, type) => type === 'password' ? 'text' : 'password')
        .focus();
    $icon.toggleClass('fa-eye fa-eye-slash');
});

// Navegación entre formularios optimizada
const toggleForms = (hide, show) => {
    $(hide).removeClass('active').addClass('hidden');
    $(show).removeClass('hidden').addClass('active');
};

$('.olvidastePass').click(e => { e.preventDefault(); toggleForms('.login-form', '.recovery-form'); });
$('.crearCuenta').click(e => { e.preventDefault(); toggleForms('.login-form', '.upd-form'); });
$('.volverLogin').click(e => { e.preventDefault(); toggleForms('.recovery-form', '.login-form'); });
$('.conCuenta').click(e => { e.preventDefault(); toggleForms('.upd-form', '.login-form'); });

// =====================================================
// # PARA LA AUTENTICACIÓN
// =====================================================

let midb = 'smiles';  //Para base de datos 
let wiAuthTm = 3000;  //Tiempo para guardar en firestore
let wiAuthIn = 'wiAuthIn';  //Para guardar auth en localstorage
let wiAuthRol = 'wiAuthRol';  //Para guardar auth en localstorage
let rol = 'smile' //Rol default
let temaAsignado = 'Cielo' //Rol default


$('.togglePass').click(function() {
  const input = $(this).siblings('input');
  const isPassword = input.attr('type') === 'password';
  input.attr('type', isPassword ? 'text' : 'password');
  $(this).toggleClass('fa-eye fa-eye-slash');
}); // Toggle password visibilidad

$('.miauth input:not([type="checkbox"])').on('click', function() {
  witip(this, $(this).attr('placeholder'));
}); //Tooltips validaciones 

$('#regUsuario, #regEmail, #email, #recEmail').on('input', function() {
  $(this).val($(this).val().toLowerCase().trim());
}); // Conversión a minúsculas

[['#password','#Login'], ['#regPassword1','#Registrar'], ['#recFechaNacimiento','#Recuperar'], ['#recEmail','#Recuperar']].forEach(([input, btn]) => {
  $(input).on('input keyup', e => {
    $(btn).removeClass('inactivo'); // 🌟 BRILLAR COMO EL SOL
    e.key === 'Enter' && ($(btn).click(), $(btn).addClass('inactivo')); // Click + Procesando
  });
}); // Tecla Enter para login y registro

const validacionesRegistro = {
      regEmail: [v => v.toLowerCase(), v => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v) || 'Correo inválido'],
      regUsuario: [v => v.toLowerCase().replace(/[^a-z0-9_]/g, ''), v => v.length >= 3 || 'Usuario 3-20 caracteres'],
      regNombre: [v => v.trim(), v => v.length > 0 || 'Ingrese nombre'],
      regApellidos: [v => v.trim(), v => v.length > 0 || 'Ingrese apellidos'],
      regGenero: [v => v, v => ['femenino','masculino'].includes(v) || 'Selecciona género'],
      regFechaNacimiento: [v => v, v => calcularEdad(v) >= 13 || 'Tienes que ser mayor de 13 años'],
      regPassword: [v => v, v => v.length >= 6 || 'Mínimo 6 caracteres'],
      regPassword1: [v => v, v => v === $('#regPassword').val() || 'Contraseñas no coinciden']
};
$.each(validacionesRegistro, function(id, [tis, validado]) {
    $(`#${id}`).on('blur change', function() {
      const vl = tis($(this).val());  $(this).val(vl);
      const result = validado(vl);
      if (result !== true) witip(this, result, 'error');
    });
}); // Validaciones en tiempo real

let usuarioListo = false;
$('#regUsuario').on('blur focus', async function(){
    const usuarioVL = $(this).val();
    if(usuarioVL.length >= 3){
      try{
        const busq = await getDoc(doc(db, midb, usuarioVL));
      const existe = busq.exists();  usuarioListo = !existe; //Para validar
      const mensaje = `Usuario ${existe ? 'no disponible' : 'disponible <i class="fa-solid fa-circle-check"></i>'}`;
      witip(this, mensaje, existe ? 'error' : 'success','top',7000);
      }catch(e){console.error(e)}
    }
}); // Validaciones para el usuario disponible con firestore

let emailListo = false;
$('#regEmail').on('blur focus', async function(){
    const emailVL = $(this).val();
    if(emailVL.length >= 3){
      try{
        const busq = await getDocs(query(collection(db, midb), where('email', '==', emailVL)));
        const existe = !busq.empty; emailListo = !existe; //Para validar
        const mensaje = `Email ${existe ? 'no disponible' : 'disponible <i class="fa-solid fa-circle-check"></i>'}`;
        witip(this, mensaje, existe ? 'error' : 'success','top',7000);
      }catch(e){console.error(e)}
    }
}); // Validación para email disponible con firestore

$('#Registrar').click(async function(){
  const todasValidaciones = [[usuarioListo, $('#regUsuario')[0], 'Usuario no disponible'], [emailListo, $('#regEmail')[0], 'Email no disponible'],
    ...Object.entries(validacionesRegistro).map(([id, [tis, validado]]) => {
      const campo = $(`#${id}`), vl = tis(campo.val()), result = validado(vl);
      return [result === true, campo[0], result !== true ? result : ''];
  })]; // Validando las entradas
  for (const [listo, campo, mensaje] of todasValidaciones) {
    if (!listo && mensaje && (witip(campo, mensaje, 'error'), campo.focus(), true)) return;
  } // Validando las entradas con mensaje para registrar

  try {
    //Trayendo valores listos y verificados
    const campos = ['regEmail', 'regUsuario', 'regNombre', 'regApellidos', 'regGenero', 'regPassword'];
    const [email, usuario, nombre, apellidos, genero, password] = campos.map(id=> $('#' + id).val().trim());
    
    // ASIGNAR TEMA SEGÚN GÉNERO
  const temasGenero = { masculino: ['Cielo|#0EBEFF','Paz|#29C72E'], femenino: ['Dulce|#FF5C69','Mora|#7000FF'] };
  const pool = temasGenero[genero] || ['Paz|#29C72E','Cielo|#0EBEFF']; temaAsignado = pool[Math.floor(Math.random()*pool.length)];


    // REGISTRANDO EN AUTH 
    const {user} = await createUserWithEmailAndPassword(auth, email, password);
    await Promise.all([updateProfile(user, { displayName: usuario}), sendEmailVerification(user)]); 
    console.log('Registro completo en Auth <i class="fa-solid fa-circle-check"></i>' + Date());

    
    // REGISTRANDO DATOS EN DB 
    const wisave = doc(db, midb, usuario);
    await setDoc(wisave,{
      usuario,     
      email,         
      nombre,     
      apellidos,  
      genero,
      rol,    
      fechaNacimiento: fechaLocal($('#regFechaNacimiento').val()),
      creacion: serverTimestamp(),
      participa: 'si',
      imagen: '',
      descripcion: '',
      uid: user.uid
    });
    // REGISTRANDO PREFERENCIAS EN DB
    await setDoc(doc(db, 'preferencias', usuario), {
      usuario, email,
      wiTema: temaAsignado,
      fechaActualizacion: serverTimestamp()
    });

    console.log('Registro completo en Firestore <i class="fa-solid fa-circle-check"></i>' + Date());
    Mensaje('Registro completado! <i class="fa-solid fa-circle-check"></i>');

  }catch(e){Mensaje({'auth/email-already-in-use': 'Email ya registrado', 'auth/weak-password': 'Contraseña muy débil'}[e.code] || e.message) || console.error(e);}
  finally{savels(wiAuthIn,'wIn',24); savels(wiAuthRol,rol,24); savels('wiTema',temaAsignado,72); setTimeout(()=> (accederRol(rol)), wiAuthTm);}
});

// LOGIN CENTER APP 
$('#Login').click(async function() {
  showLoading(true);
  try {
    const [usuario, password] = ['#email', '#password'].map(id => $(id).val());
    const esEmail = usuario.includes('@');
    const busq = !esEmail ? await getDoc(doc(db, midb, usuario)) : null;
    if (!esEmail && !busq.exists()) throw new Error('Usuario no encontrado');
    const email = esEmail ? usuario : busq.data().email;
    await signInWithEmailAndPassword(auth, email, password);
    
    const tema = !esEmail && (await getDoc(doc(db, 'preferencias', usuario)))?.data?.()?.wiTema || null;//Temas 
    const rol = busq?.data()?.rol || 'smile'; accederRol(rol); //Acceder rol 

    savels(wiAuthIn,'wIn',24); savels(wiAuthRol, rol, 24); if(tema) savels('wiTema', tema, 72); //Cache para optimizar
  } catch(e) {
    const err = {'auth/invalid-credential':'Contraseña incorrecta','auth/invalid-email':'Falta registrar Email','auth/missing-email':'Email o usuario no registrado'};
    Mensaje(err[e.code] || e.message, 'error'); console.error(e);
  } finally { showLoading(false); }
});

// RECUPERAR CENTER APP 
$('#Recuperar').click(async function() {
  try {
    const [campo, fecha] = ['#recEmail', '#recFechaNacimiento'].map(id => $(id).val());
    
    // Convertir + validar usuario
    const email = campo.includes('@') ? campo : await (async () => {
      const b = await getDoc(doc(db, midb, campo));
      return b.exists() ? b.data().email : null;
    })();
    if (!email) return Mensaje('Usuario no registrado', 'error');
    
    // Buscar + validar email
    const busq = await getDocs(query(collection(db, midb), where('email', '==', email)));
    if (busq.empty) return Mensaje('Email incorrecto o no existe', 'error');
    
    // Validar fecha
    const fechabd = busq.docs[0].data().fechaNacimiento.toDate().toISOString().split('T')[0];
    if (fechabd !== fecha) return Mensaje('Fecha de nacimiento incorrecta', 'error');
    
    // Enviar
    await sendPasswordResetEmail(auth, email);
    Mensaje('Se envió correo para restablecer su contraseña, revisa en principal o spam <i class="fa-solid fa-circle-check"></i>', 'success');
    
  }catch(e){console.error(e);}
});