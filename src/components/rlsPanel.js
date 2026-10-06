export function renderRlsPanel() {
  return `
    <section class="rls-panel-card card">
      <h2>Panel de Pruebas RLS (Por ID)</h2>
      <div class="rls-controls">
        <input type="number" id="rls-task-id" placeholder="ID de tarea">
        <button id="btn-rls-buscar" class="btn-secundario">Buscar por ID</button>
        <button id="btn-rls-modificar" class="btn-secundario">Modificar por ID</button>
        <button id="btn-rls-eliminar" class="btn-danger">Eliminar por ID</button>
      </div>
      <div id="rls-result" class="rls-result"></div>
    </section>
  `
}

export function setupRlsEvents({ onBuscarPorId, onModificarPorId, onEliminarPorId }) {
  document.querySelector('#btn-rls-buscar')?.addEventListener('click', () => {
    const id = document.querySelector('#rls-task-id').value
    if (id) onBuscarPorId(id)
  })

  document.querySelector('#btn-rls-modificar')?.addEventListener('click', () => {
    const id = document.querySelector('#rls-task-id').value
    const nuevoTitulo = prompt('Ingresa el nuevo título para la tarea:')
    if (id && nuevoTitulo) onModificarPorId(id, nuevoTitulo)
  })

  document.querySelector('#btn-rls-eliminar')?.addEventListener('click', () => {
    const id = document.querySelector('#rls-task-id').value
    if (id) onEliminarPorId(id)
  })
}