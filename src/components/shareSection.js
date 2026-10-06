export function renderShareSection() {
  return `
    <section class="share-task-card card">
      <h2>Compartir Tarea</h2>
      <form id="share-form">
        <div class="campo">
          <label for="share-task-select">Selecciona tu tarea</label>
          <select id="share-task-select" required>
            <option value="">Cargando tareas...</option>
          </select>
        </div>
        <div class="campo">
          <label for="share-user-select">Selecciona el usuario</label>
          <select id="share-user-select" required>
            <option value="">Cargando usuarios...</option>
          </select>
        </div>
        <button type="submit" class="btn-secundario">Compartir tarea</button>
      </form>
      <p id="share-mensaje" class="mensaje"></p>
    </section>
  `
}

export function setupShareEvents(onCompartirTarea) {
  const form = document.querySelector('#share-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const taskId = document.querySelector('#share-task-select').value
    const userId = document.querySelector('#share-user-select').value
    if (taskId && userId) onCompartirTarea(taskId, userId)
  })
}

export function updateShareDropdowns(tareas, perfiles, usuarioActualId) {
  const selectTareas = document.querySelector('#share-task-select')
  const selectUsuarios = document.querySelector('#share-user-select')
  if (!selectTareas || !selectUsuarios) return

  const tareasPropias = tareas.filter(t => t.user_id === usuarioActualId)
  selectTareas.innerHTML = tareasPropias.length === 0
    ? '<option value="">No tienes tareas para compartir</option>'
    : '<option value="">-- Selecciona una tarea --</option>' + tareasPropias.map(t => `<option value="${t.id}">${t.title}</option>`).join('')

  const otrosUsuarios = perfiles.filter(p => p.id !== usuarioActualId)
  selectUsuarios.innerHTML = otrosUsuarios.length === 0
    ? '<option value="">No hay otros usuarios registrados</option>'
    : '<option value="">-- Selecciona un usuario --</option>' + otrosUsuarios.map(p => `<option value="${p.id}">${p.name}</option>`).join('')
}