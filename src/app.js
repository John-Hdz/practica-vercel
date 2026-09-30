import {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerUsuarioActual
} from './services/authService.js'

import {
  obtenerTareas,
  crearTarea,
  cambiarEstado,
  eliminarTarea,
  suscribirseATareas,
  cancelarSuscripcion
} from './services/taskService.js'

import {
  mostrarLoginView,
  configurarLoginView,
  mostrarMensajeLogin
} from './views/loginView.js'

import {
  mostrarTasksView,
  configurarTasksView,
  mostrarTareas,
  mostrarCargandoTareas,
  limpiarFormularioTarea
} from './views/tasksView.js'

import {
  mostrarConfirmacion
} from './components/confirmModal.js'


let usuarioActual = null
let canalRealtime = null


export async function iniciarApp() {
  const {
    user,
    error
  } = await obtenerUsuarioActual()


  if (error) {
    console.error(
      'Error al recuperar sesión:',
      error
    )

    mostrarPantallaLogin()

    return
  }


  if (user) {
    await mostrarPantallaTareas(user)
  } else {
    mostrarPantallaLogin()
  }
}


function mostrarPantallaLogin(
  mensaje = ''
) {
  usuarioActual = null

  mostrarLoginView({
    mensaje
  })


  configurarLoginView({
    onLogin: manejarLogin,
    onRegistro: manejarRegistro
  })
}


async function mostrarPantallaTareas(
  user
) {
  usuarioActual = user

  mostrarTasksView(user)


  configurarTasksView({
    onCrear: manejarCrearTarea,
    onLogout: manejarLogout
  })


  await cargarTareas()

  await activarRealtime()
}


async function manejarLogin({
  email,
  password
}) {
  if (!email || !password) {
    mostrarMensajeLogin(
      'Ingresa correo y contraseña.'
    )

    return
  }


  const {
    data,
    error
  } = await iniciarSesion(
    email,
    password
  )


  if (error) {
    mostrarMensajeLogin(
      'Error: ' + error.message
    )

    return
  }


  if (data.user) {
    await mostrarPantallaTareas(
      data.user
    )
  }
}


async function manejarRegistro({
  email,
  password
}) {
  if (!email || !password) {
    mostrarMensajeLogin(
      'Ingresa correo y contraseña.'
    )

    return
  }


  const {
    data,
    error
  } = await registrarUsuario(
    email,
    password
  )


  if (error) {
    mostrarMensajeLogin(
      'Error: ' + error.message
    )

    return
  }


  if (data.session && data.user) {
    await mostrarPantallaTareas(
      data.user
    )

    return
  }


  mostrarMensajeLogin(
    'Usuario registrado. Revisa tu correo si se requiere confirmación.'
  )
}


async function manejarLogout() {
  await detenerRealtime()


  const {
    error
  } = await cerrarSesion()


  if (error) {
    console.error(
      'Error al cerrar sesión:',
      error
    )

    return
  }


  mostrarPantallaLogin(
    'Sesión cerrada correctamente.'
  )
}


async function cargarTareas() {
  mostrarCargandoTareas()


  const {
    data,
    error
  } = await obtenerTareas()


  if (error) {
    console.error(
      'Error al obtener tareas:',
      error
    )

    return
  }


  mostrarTareas({
    tareas: data,

    onCambiarEstado:
      manejarCambioEstado,

    onEliminar:
      solicitarEliminarTarea
  })
}


async function manejarCrearTarea({
  title,
  description,
  priority
}) {
  if (!usuarioActual) {
    return
  }


  const {
    error
  } = await crearTarea({
    title,
    description,
    priority,
    userId: usuarioActual.id
  })


  if (error) {
    console.error(
      'Error al crear tarea:',
      error
    )

    return
  }


  limpiarFormularioTarea()

  // Realtime actualizará la lista.
}


async function manejarCambioEstado({
  id,
  estadoActual
}) {
  if (!usuarioActual) {
    return
  }


  const {
    error
  } = await cambiarEstado(
    id,
    estadoActual,
    usuarioActual.id
  )


  if (error) {
    console.error(
      'Error al cambiar estado:',
      error
    )
  }

  // Realtime actualizará la lista.
}


function solicitarEliminarTarea(id) {
  mostrarConfirmacion({
    titulo: 'Eliminar tarea',

    mensaje:
      '¿Seguro que deseas eliminar esta tarea?',

    textoConfirmar:
      'Eliminar',

    onConfirmar:
      async () => {

        if (!usuarioActual) {
          return
        }


        const {
          error
        } = await eliminarTarea(
          id,
          usuarioActual.id
        )


        if (error) {
          console.error(
            'Error al eliminar tarea:',
            error
          )
        }

        // Realtime actualizará la lista.
      }
  })
}


async function activarRealtime() {
  await detenerRealtime()


  canalRealtime =
    suscribirseATareas(
      async () => {
        await cargarTareas()
      }
    )
}


async function detenerRealtime() {
  if (!canalRealtime) {
    return
  }


  await cancelarSuscripcion(
    canalRealtime
  )

  canalRealtime = null
}