function escaparHTML(valor) {
  if (valor === null || valor === undefined) {
    return ''
  }

  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}


export function mostrarTasksView(user) {
  document.querySelector('#app').innerHTML = `
    <main class="tasks-page">

      <header class="app-header">

        <div>
          <h1>Gestor de tareas</h1>

          <p>
            Sesión:
            <strong>
              ${escaparHTML(user.email)}
            </strong>
          </p>
        </div>

        <button
          id="btn-logout"
          class="btn-secundario"
        >
          Cerrar sesión
        </button>

      </header>


      <section class="panel">

        <h2>Nueva tarea</h2>

        <form id="form-tarea">

          <div class="campo">

            <label for="title">
              Título
            </label>

            <input
              type="text"
              id="title"
              placeholder="Título de la tarea"
              required
            >

          </div>


          <div class="campo">

            <label for="description">
              Descripción
            </label>

            <input
              type="text"
              id="description"
              placeholder="Descripción"
            >

          </div>


          <div class="campo">

            <label for="priority">
              Prioridad
            </label>

            <select
              id="priority"
              required
            >

              <option value="">
                Selecciona prioridad
              </option>

              <option value="Alta">
                Alta
              </option>

              <option value="Media">
                Media
              </option>

              <option value="Baja">
                Baja
              </option>

            </select>

          </div>


          <button
            type="submit"
            class="btn-principal"
          >
            Agregar tarea
          </button>

        </form>

      </section>


      <section class="panel">

        <h2>Mis tareas</h2>

        <div id="lista-tareas">

          <p class="mensaje">
            Cargando tareas...
          </p>

        </div>

      </section>

    </main>
  `
}


export function configurarTasksView({
  onCrear,
  onLogout
}) {
  document
    .querySelector('#form-tarea')
    .addEventListener(
      'submit',
      event => {

        event.preventDefault()

        const title =
          document.querySelector('#title').value

        const description =
          document.querySelector(
            '#description'
          ).value

        const priority =
          document.querySelector(
            '#priority'
          ).value


        onCrear({
          title,
          description,
          priority
        })
      }
    )


  document
    .querySelector('#btn-logout')
    .addEventListener(
      'click',
      onLogout
    )
}


export function mostrarTareas({
  tareas,
  onCambiarEstado,
  onEliminar
}) {
  const lista =
    document.querySelector('#lista-tareas')


  if (!tareas || tareas.length === 0) {
    lista.innerHTML = `
      <p class="mensaje">
        No tienes tareas registradas.
      </p>
    `

    return
  }


  lista.innerHTML = tareas
    .map(tarea => `
      <article class="tarea">

        <div class="tarea-contenido">

          <h3>
            ${escaparHTML(tarea.title)}
          </h3>

          <p>
            ${
              escaparHTML(tarea.description)
              || 'Sin descripción'
            }
          </p>


          <div class="tarea-info">

            <span>
              <strong>Prioridad:</strong>
              ${escaparHTML(tarea.priority)}
            </span>

            <span>
              <strong>Estado:</strong>

              ${
                tarea.completed
                  ? 'Completada'
                  : 'Pendiente'
              }
            </span>

          </div>

        </div>


        <div class="acciones">

          <button
            class="btn-estado"
            data-id="${tarea.id}"
            data-completed="${tarea.completed}"
          >

            ${
              tarea.completed
                ? 'Marcar pendiente'
                : 'Completar'
            }

          </button>


          <button
            class="btn-eliminar"
            data-id="${tarea.id}"
          >
            Eliminar
          </button>

        </div>

      </article>
    `)
    .join('')


  document
    .querySelectorAll('.btn-estado')
    .forEach(boton => {

      boton.addEventListener(
        'click',
        () => {

          onCambiarEstado({
            id: Number(
              boton.dataset.id
            ),

            estadoActual:
              boton.dataset.completed ===
              'true'
          })
        }
      )
    })


  document
    .querySelectorAll('.btn-eliminar')
    .forEach(boton => {

      boton.addEventListener(
        'click',
        () => {

          onEliminar(
            Number(
              boton.dataset.id
            )
          )
        }
      )
    })
}


export function mostrarCargandoTareas() {
  document.querySelector(
    '#lista-tareas'
  ).innerHTML = `
    <p class="mensaje">
      Cargando tareas...
    </p>
  `
}


export function limpiarFormularioTarea() {
  document
    .querySelector('#form-tarea')
    ?.reset()
}