import { renderAccountSection, setupAccountEvents } from '../components/accountSection.js'
import { renderShareSection, setupShareEvents, updateShareDropdowns } from '../components/shareSection.js'
import { renderRlsPanel, setupRlsEvents } from '../components/rlsPanel.js'

export function mostrarTasksView(usuario) {
  const name = usuario.name || 'Usuario'
  const email = usuario.email || ''

  document.querySelector('#app').innerHTML = `
    <main class="tasks-page">
      <header class="app-header">
        <div class="user-info">
          <h1>Hola, <span id="user-name">${name}</span></h1>
          <h1>Esta es una prueba de Preview Deployment</h1>
          <p class="user-email">${email}</p>
        </div>
        <button id="btn-logout" class="btn-danger">Cerrar sesión</button>
      </header>

      ${renderAccountSection(name, email)}
      ${renderShareSection()}

      <section class="task-form-card card">
        <h2>Nueva Tarea</h2>
        <form id="task-form">
          <div class="campo">
            <label for="task-title">Título</label>
            <input type="text" id="task-title" required placeholder="Ej. Estudiar Supabase">
          </div>
          <div class="campo">
            <label for="task-desc">Descripción</label>
            <textarea id="task-desc" placeholder="Descripción opcional"></textarea>
          </div>
          <div class="campo">
            <label for="task-priority">Prioridad</label>
            <select id="task-priority">
              <option value="baja">Baja</option>
              <option value="media" selected>Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <button type="submit" class="btn-principal">Guardar Tarea</button>
        </form>
      </section>

      <section class="tasks-list-card card">
        <h2>Mis Tareas</h2>
        <div id="tasks-container">Cargando tareas...</div>
      </section>

      ${renderRlsPanel()}
    </main>
  `
}

export function configurarTasksView({
  onCrear,
  onLogout,
  onCambiarPassword,
  onCompartirTarea,
  onBuscarPorId,
  onModificarPorId,
  onEliminarPorId
}) {
  document.querySelector('#btn-logout')?.addEventListener('click', onLogout)

  setupAccountEvents(onCambiarPassword)
  setupShareEvents(onCompartirTarea)
  setupRlsEvents({ onBuscarPorId, onModificarPorId, onEliminarPorId })

  document.querySelector('#task-form')?.addEventListener('submit', e => {
    e.preventDefault()
    onCrear({
      title: document.querySelector('#task-title').value,
      description: document.querySelector('#task-desc').value,
      priority: document.querySelector('#task-priority').value
    })
  })
}

export function llenarOpcionesCompartir(tareas, perfiles, usuarioActualId) {
  updateShareDropdowns(tareas, perfiles, usuarioActualId)
}

export function mostrarMensajePassword(mensaje, esError = false) {
  const el = document.querySelector('#password-mensaje')
  if (el) {
    el.textContent = mensaje
    el.style.color = esError ? '#e53e3e' : '#38a169'
  }
}

export function mostrarMensajeCompartir(mensaje, esError = false) {
  const el = document.querySelector('#share-mensaje')
  if (el) {
    el.textContent = mensaje
    el.style.color = esError ? '#e53e3e' : '#38a169'
    setTimeout(() => { el.textContent = '' }, 4000)
  }
}

export function mostrarTareas({ tareas, onCambiarEstado, onEliminar }) {
  const container = document.querySelector('#tasks-container')
  if (!container) return

  if (!tareas || tareas.length === 0) {
    container.innerHTML = '<p>No hay tareas registradas.</p>'
    return
  }

  container.innerHTML = tareas.map(t => `
    <div class="task-item ${t.completed ? 'completed' : ''}">
      <div>
        <h3>[ID: ${t.id}] ${t.title} <span class="badge ${t.priority}">${t.priority}</span></h3>
        <p>${t.description || ''}</p>
      </div>
      <div class="task-actions">
        <button data-id="${t.id}" data-status="${t.completed}" class="btn-status">
          ${t.completed ? 'Desmarcar' : 'Completar'}
        </button>
        <button data-id="${t.id}" class="btn-delete btn-danger">Eliminar</button>
      </div>
    </div>
  `).join('')

  container.querySelectorAll('.btn-status').forEach(btn => {
    btn.addEventListener('click', () => {
      onCambiarEstado({ id: btn.dataset.id, estadoActual: btn.dataset.status === 'true' })
    })
  })

  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => onEliminar(btn.dataset.id))
  })
}

export function mostrarCargandoTareas() {
  const container = document.querySelector('#tasks-container')
  if (container) container.innerHTML = '<p>Cargando...</p>'
}

export function limpiarFormularioTarea() {
  document.querySelector('#task-form')?.reset()
}

export function mostrarResultadoRls(mensaje, tipo = 'info') {
  const el = document.querySelector('#rls-result')
  if (el) {
    el.textContent = mensaje
    el.className = `rls-result rls-${tipo}`
  }
}