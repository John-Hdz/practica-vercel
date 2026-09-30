const app = document.querySelector('#app')


export function mostrarTasksView(user) {
  app.innerHTML = `
    <main class="tasks-page">

      <!-- ==============================
           ENCABEZADO
      ============================== -->

      <header class="app-header">

        <div>
          <h1>Gestor de tareas</h1>

          <p>
            Sesión iniciada como:
            <strong>${user.email}</strong>
          </p>
        </div>

        <button
          id="btnLogout"
          class="btn-secundario"
        >
          Cerrar sesión
        </button>

      </header>


      <!-- ==============================
           CREAR TAREA
      ============================== -->

      <section class="panel">

        <h2>Nueva tarea</h2>

        <form id="taskForm">

          <div class="campo">

            <label for="title">
              Título
            </label>

            <input
              id="title"
              type="text"
              required
              placeholder="Título de la tarea"
            >

          </div>


          <div class="campo">

            <label for="description">
              Descripción
            </label>

            <input
              id="description"
              type="text"
              placeholder="Descripción de la tarea"
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
              <option value="Baja">
                Baja
              </option>

              <option value="Media">
                Media
              </option>

              <option value="Alta">
                Alta
              </option>
            </select>

          </div>


          <button
            type="submit"
            class="btn-principal"
          >
            Crear tarea
          </button>

        </form>

      </section>


      <!-- ==============================
           LISTA DE TAREAS
      ============================== -->

      <section class="panel">

        <h2>Mis tareas</h2>

        <div id="lista-tareas">
          Cargando tareas...
        </div>

      </section>


      <!-- ==============================
           PANEL EDUCATIVO RLS
      ============================== -->

      <section class="panel rls-panel">

        <div class="rls-header">

          <div>
            <h2>
              Panel de prueba RLS por ID
            </h2>

            <p>
              Este apartado permite comprobar cómo
              Row Level Security protege los registros
              aunque conozcas directamente su ID.
            </p>
          </div>


          <span class="rls-badge">
            PRUEBA EDUCATIVA
          </span>

        </div>


        <div class="rls-warning">

          En una aplicación real el usuario normalmente
          no manipularía directamente los IDs de esta
          forma. Este panel existe únicamente para
          comprobar las políticas RLS.

        </div>


        <div class="campo">

          <label for="rlsTaskId">
            ID de la tarea
          </label>

          <input
            id="rlsTaskId"
            type="number"
            min="1"
            placeholder="Ejemplo: 5"
          >

        </div>


        <div class="rls-buttons">

          <button
            id="btnBuscarRls"
            type="button"
            class="btn-estado"
          >
            Buscar por ID
          </button>


          <button
            id="btnModificarRls"
            type="button"
            class="btn-estado"
          >
            Modificar por ID
          </button>


          <button
            id="btnEliminarRls"
            type="button"
            class="btn-peligro"
          >
            Eliminar por ID
          </button>

        </div>


        <!-- Campos para modificar -->

        <div
          id="rlsModificarCampos"
          class="rls-modificar hidden"
        >

          <div class="campo">

            <label for="rlsNuevoTitulo">
              Nuevo título
            </label>

            <input
              id="rlsNuevoTitulo"
              type="text"
              placeholder="Escribe el nuevo título"
            >

          </div>


          <button
            id="btnConfirmarModificarRls"
            type="button"
            class="btn-estado"
          >
            Confirmar modificación
          </button>

        </div>


        <!-- Resultado -->

        <div class="rls-result-container">

          <h3>Resultado</h3>

          <div
            id="rlsResultado"
            class="rls-result"
          >
            Realiza una prueba utilizando el ID
            de una tarea.
          </div>

        </div>

      </section>

    </main>
  `
}


// ==========================================
// EVENTOS DE LA VISTA
// ==========================================

export function configurarTasksView({
  onCrear,
  onLogout,
  onBuscarPorId,
  onModificarPorId,
  onEliminarPorId
}) {

  const form =
    document.querySelector('#taskForm')

  const btnLogout =
    document.querySelector('#btnLogout')

  const btnBuscarRls =
    document.querySelector('#btnBuscarRls')

  const btnModificarRls =
    document.querySelector('#btnModificarRls')

  const btnEliminarRls =
    document.querySelector('#btnEliminarRls')

  const btnConfirmarModificarRls =
    document.querySelector(
      '#btnConfirmarModificarRls'
    )

  const camposModificar =
    document.querySelector(
      '#rlsModificarCampos'
    )


  // Crear tarea

  form.addEventListener(
    'submit',
    event => {

      event.preventDefault()


      const title =
        document
          .querySelector('#title')
          .value
          .trim()


      const description =
        document
          .querySelector('#description')
          .value
          .trim()


      const priority =
        document
          .querySelector('#priority')
          .value


      if (!title) {
        return
      }


      onCrear({
        title,
        description,
        priority
      })
    }
  )


  // Cerrar sesión

  btnLogout.addEventListener(
    'click',
    () => {
      onLogout()
    }
  )


  // ==========================================
  // BUSCAR POR ID
  // ==========================================

  btnBuscarRls.addEventListener(
    'click',
    () => {

      const id = obtenerIdRls()


      if (!id) {

        mostrarResultadoRls(
          'Ingresa un ID válido.',
          'error'
        )

        return
      }


      onBuscarPorId(id)
    }
  )


  // ==========================================
  // MOSTRAR CAMPOS DE MODIFICACIÓN
  // ==========================================

  btnModificarRls.addEventListener(
    'click',
    () => {

      const id = obtenerIdRls()


      if (!id) {

        mostrarResultadoRls(
          'Ingresa un ID válido.',
          'error'
        )

        return
      }


      camposModificar.classList.remove(
        'hidden'
      )
    }
  )


  // ==========================================
  // CONFIRMAR MODIFICACIÓN
  // ==========================================

  btnConfirmarModificarRls.addEventListener(
    'click',
    () => {

      const id = obtenerIdRls()


      const nuevoTitulo =
        document
          .querySelector(
            '#rlsNuevoTitulo'
          )
          .value
          .trim()


      if (!id) {

        mostrarResultadoRls(
          'Ingresa un ID válido.',
          'error'
        )

        return
      }


      if (!nuevoTitulo) {

        mostrarResultadoRls(
          'Escribe el nuevo título.',
          'error'
        )

        return
      }


      onModificarPorId(
        id,
        nuevoTitulo
      )
    }
  )


  // ==========================================
  // ELIMINAR POR ID
  // ==========================================

  btnEliminarRls.addEventListener(
    'click',
    () => {

      const id = obtenerIdRls()


      if (!id) {

        mostrarResultadoRls(
          'Ingresa un ID válido.',
          'error'
        )

        return
      }


      onEliminarPorId(id)
    }
  )
}


// ==========================================
// OBTENER ID DEL PANEL RLS
// ==========================================

function obtenerIdRls() {

  const input =
    document.querySelector(
      '#rlsTaskId'
    )


  const id =
    Number(input.value)


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null
  }


  return id
}


// ==========================================
// MOSTRAR RESULTADO RLS
// ==========================================

export function mostrarResultadoRls(
  mensaje,
  tipo = 'normal'
) {

  const resultado =
    document.querySelector(
      '#rlsResultado'
    )


  if (!resultado) {
    return
  }


  resultado.textContent =
    mensaje


  resultado.className =
    `rls-result ${tipo}`
}


// ==========================================
// MOSTRAR TAREAS
// ==========================================

export function mostrarTareas({
  tareas,
  onCambiarEstado,
  onEliminar
}) {

  const lista =
    document.querySelector(
      '#lista-tareas'
    )


  if (!tareas || tareas.length === 0) {

    lista.innerHTML = `
      <p class="mensaje">
        No tienes tareas registradas.
      </p>
    `

    return
  }


  lista.innerHTML =
    tareas
      .map(tarea => `

        <article class="tarea">

          <div>

            <h3>
              ${tarea.title}
            </h3>


            <p>
              ${
                tarea.description ||
                'Sin descripción'
              }
            </p>


            <div class="tarea-info">

              <span>
                <strong>ID:</strong>
                ${tarea.id}
              </span>


              <span>
                <strong>Prioridad:</strong>
                ${tarea.priority}
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
              data-action="estado"
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
              data-action="eliminar"
              data-id="${tarea.id}"
            >
              Eliminar
            </button>

          </div>

        </article>

      `)
      .join('')


  // Botones para cambiar estado

  document
    .querySelectorAll(
      '[data-action="estado"]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const id =
            Number(
              button.dataset.id
            )


          const estadoActual =
            button.dataset.completed ===
            'true'


          onCambiarEstado({
            id,
            estadoActual
          })
        }
      )
    })


  // Botones para eliminar

  document
    .querySelectorAll(
      '[data-action="eliminar"]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const id =
            Number(
              button.dataset.id
            )


          onEliminar(id)
        }
      )
    })
}


// ==========================================
// CARGANDO
// ==========================================

export function mostrarCargandoTareas() {

  const lista =
    document.querySelector(
      '#lista-tareas'
    )


  if (!lista) {
    return
  }


  lista.innerHTML = `
    <p class="mensaje">
      Cargando tareas...
    </p>
  `
}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

export function limpiarFormularioTarea() {

  const form =
    document.querySelector(
      '#taskForm'
    )


  if (form) {
    form.reset()
  }
}