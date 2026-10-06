import {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerUsuarioActual,
  cambiarPassword,
  obtenerTodosLosPerfiles // <-- Agregado
} from './services/authService.js'  

import {
  obtenerTareas,
  crearTarea,
  cambiarEstado,
  eliminarTarea,
  buscarTareaPorId,
  modificarTareaPorId,
  eliminarTareaPorId,
  suscribirseATareas,
  cancelarSuscripcion,
  compartirTarea // <-- Agregado
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
  limpiarFormularioTarea,
  mostrarMensajePassword,
  mostrarResultadoRls,
  llenarOpcionesCompartir, // <-- Agregado
  mostrarMensajeCompartir // <-- Agregado
} from './views/tasksView.js'

import {
  mostrarConfirmacion
} from './components/confirmModal.js'

let usuarioActual = null
let perfilActual = null
let canalRealtime = null

export async function iniciarApp() {
  // Obtenemos tanto el usuario de Auth como su perfil asociado
  const {
    user,
    profile,
    error
  } = await obtenerUsuarioActual()

  if (error) {
    console.error('Error al recuperar sesión:', error)
    mostrarPantallaLogin()
    return
  }

  if (user) {
    await mostrarPantallaTareas(user, profile)
  } else {
    mostrarPantallaLogin()
  }
}

function mostrarPantallaLogin(mensaje = '') {
  usuarioActual = null
  perfilActual = null

  mostrarLoginView({ mensaje })

  configurarLoginView({
    onLogin: manejarLogin,
    onRegistro: manejarRegistro
  })
}

async function mostrarPantallaTareas(user, profile) {
  usuarioActual = user
  perfilActual = profile

  // Pasamos el objeto usuario con el perfil (nombre) para renderizar en pantalla
  mostrarTasksView({
    ...user,
    name: profile ? profile.name : 'Usuario'
  })

  configurarTasksView({
    onCrear: manejarCrearTarea,
    onLogout: manejarLogout,
    onCambiarPassword: manejarCambiarPassword, // Integrado para la Actividad 2
    onCompartirTarea: manejarCompartirTarea, // <-- Agregado
    onBuscarPorId: manejarBuscarTareaPorId,
    onModificarPorId: manejarModificarTareaPorId,
    onEliminarPorId: solicitarEliminarTareaPorId
  })

  await cargarTareas()
  await activarRealtime()
}

// ==========================================
// AUTH & PERFIL (Actividad 1 y 2)
// ==========================================

async function manejarLogin({ email, password }) {
  if (!email || !password) {
    mostrarMensajeLogin('Ingresa correo y contraseña.')
    return
  }

  const { data, error } = await iniciarSesion(email, password)

  if (error) {
    mostrarMensajeLogin('Error: ' + error.message)
    return
  }

  if (data.user) {
    const { profile } = await obtenerUsuarioActual()
    await mostrarPantallaTareas(data.user, profile)
  }
}

async function manejarRegistro({ name, email, password }) {
  if (!name || !email || !password) {
    mostrarMensajeLogin('Ingresa tu nombre completo, correo y contraseña.')
    return
  }

  const { data, error } = await registrarUsuario(email, password, name)

  if (error) {
    mostrarMensajeLogin('Error: ' + error.message)
    return
  }

  if (data.session && data.user) {
    const { profile } = await obtenerUsuarioActual()
    await mostrarPantallaTareas(data.user, profile)
    return
  }

  mostrarMensajeLogin('Usuario registrado. Puedes iniciar sesión ahora.')
}

async function manejarCambiarPassword(nuevaPassword) {
  if (!nuevaPassword) return

  const { error } = await cambiarPassword(nuevaPassword)

  if (error) {
    mostrarMensajePassword('Error al actualizar contraseña: ' + error.message, true)
  } else {
    mostrarMensajePassword('¡Contraseña actualizada correctamente!')
    document.querySelector('#new-password').value = ''
  }
}

async function manejarLogout() {
  await detenerRealtime()

  const { error } = await cerrarSesion()

  if (error) {
    console.error('Error al cerrar sesión:', error)
    return
  }

  mostrarPantallaLogin('Sesión cerrada correctamente.')
}

// ==========================================
// CRUD NORMAL
// ==========================================

async function cargarTareas() {
  mostrarCargandoTareas()

  const { data: tareas, error: errorTareas } = await obtenerTareas()
  
  if (errorTareas) {
    console.error('Error al obtener tareas:', errorTareas)
    return
  }

  mostrarTareas({
    tareas,
    onCambiarEstado: manejarCambioEstado,
    onEliminar: solicitarEliminarTarea
  })

  // Actualizar los dropdowns de compartir (Actividad 3)
  if (usuarioActual) {
    const { data: perfiles } = await obtenerTodosLosPerfiles()
    if (perfiles) {
      llenarOpcionesCompartir(tareas, perfiles, usuarioActual.id)
    }
  }
}

async function manejarCrearTarea({ title, description, priority }) {
  if (!usuarioActual) return

  const { error } = await crearTarea({
    title,
    description,
    priority,
    userId: usuarioActual.id
  })

  if (error) {
    console.error('Error al crear tarea:', error)
    return
  }

  limpiarFormularioTarea()
}

async function manejarCompartirTarea(taskId, userId) {
  if (!usuarioActual) return

  const { error } = await compartirTarea(taskId, userId)

  if (error) {
    mostrarMensajeCompartir('Error al compartir: ' + error.message, true)
  } else {
    mostrarMensajeCompartir('¡Tarea compartida correctamente!', false)
    // Limpiar el formulario visualmente
    document.querySelector('#share-form').reset()
  }
}

async function manejarCambioEstado({ id, estadoActual }) {
  if (!usuarioActual) return

  const { error } = await cambiarEstado(id, estadoActual)

  if (error) {
    console.error('Error al cambiar estado:', error)
  }
}

function solicitarEliminarTarea(id) {
  mostrarConfirmacion({
    titulo: 'Eliminar tarea',
    mensaje: '¿Seguro que deseas eliminar esta tarea?',
    textoConfirmar: 'Eliminar',
    onConfirmar: async () => {
      const { error } = await eliminarTarea(id)
      if (error) {
        console.error('Error al eliminar tarea:', error)
      }
    }
  })
}

// ==========================================
// PRUEBAS EDUCATIVAS DE RLS
// ==========================================

async function manejarBuscarTareaPorId(id) {
  mostrarResultadoRls(`Buscando tarea con ID ${id}...`)

  const { data, error } = await buscarTareaPorId(id)

  if (error) {
    mostrarResultadoRls('Error: ' + error.message, 'error')
    return
  }

  if (!data || data.length === 0) {
    mostrarResultadoRls(
      `No se encontró la tarea ${id} o no tienes permiso para verla.`,
      'blocked'
    )
    return
  }

  const tarea = data[0]

  mostrarResultadoRls(
    `Acceso permitido. ID: ${tarea.id} | Título: ${tarea.title} | Prioridad: ${tarea.priority}`,
    'success'
  )
}

async function manejarModificarTareaPorId(id, nuevoTitulo) {
  mostrarResultadoRls(`Intentando modificar la tarea ${id}...`)

  const { data, error } = await modificarTareaPorId(id, nuevoTitulo)

  if (error) {
    mostrarResultadoRls('Error: ' + error.message, 'error')
    return
  }

  if (!data || data.length === 0) {
    mostrarResultadoRls(
      `La tarea ${id} no existe o RLS impidió modificarla.`,
      'blocked'
    )
    return
  }

  mostrarResultadoRls(`Tarea ${id} modificada correctamente.`, 'success')
}

function solicitarEliminarTareaPorId(id) {
  mostrarConfirmacion({
    titulo: 'Prueba de eliminación RLS',
    mensaje: `Se intentará eliminar directamente la tarea con ID ${id}.`,
    textoConfirmar: 'Intentar eliminar',
    onConfirmar: async () => {
      mostrarResultadoRls(`Intentando eliminar la tarea ${id}...`)

      const { data, error } = await eliminarTareaPorId(id)

      if (error) {
        mostrarResultadoRls('Error: ' + error.message, 'error')
        return
      }

      if (!data || data.length === 0) {
        mostrarResultadoRls(
          `La tarea ${id} no existe o RLS impidió eliminarla.`,
          'blocked'
        )
        return
      }

      mostrarResultadoRls(`Tarea ${id} eliminada correctamente.`, 'success')
    }
  })
}

// ==========================================
// REALTIME
// ==========================================

async function activarRealtime() {
  await detenerRealtime()

  canalRealtime = suscribirseATareas(async () => {
    await cargarTareas()
  })
}

async function detenerRealtime() {
  if (!canalRealtime) return

  await cancelarSuscripcion(canalRealtime)
  canalRealtime = null
}