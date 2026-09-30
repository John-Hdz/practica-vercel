export function mostrarLoginView({
  mensaje = ''
} = {}) {
  document.querySelector('#app').innerHTML = `
    <main class="login-page">

      <section class="login-card">

        <div class="login-header">

          <h1>Gestor de tareas</h1>

          <p>
            Inicia sesión para administrar
            tus tareas con Supabase.
          </p>

        </div>


        <form id="login-form">

          <div class="campo">

            <label for="email">
              Correo electrónico
            </label>

            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              required
            >

          </div>


          <div class="campo">

            <label for="password">
              Contraseña
            </label>

            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              required
            >

          </div>


          <button
            type="submit"
            class="btn-principal"
          >
            Iniciar sesión
          </button>


          <button
            type="button"
            id="btn-registro"
            class="btn-secundario"
          >
            Registrarse
          </button>

        </form>


        <p
          id="auth-mensaje"
          class="mensaje"
        >
          ${mensaje}
        </p>

      </section>

    </main>
  `
}


export function configurarLoginView({
  onLogin,
  onRegistro
}) {
  const formulario =
    document.querySelector('#login-form')

  const botonRegistro =
    document.querySelector('#btn-registro')


  formulario.addEventListener(
    'submit',
    event => {

      event.preventDefault()

      const email =
        document.querySelector('#email').value

      const password =
        document.querySelector('#password').value

      onLogin({
        email,
        password
      })
    }
  )


  botonRegistro.addEventListener(
    'click',
    () => {

      const email =
        document.querySelector('#email').value

      const password =
        document.querySelector('#password').value

      onRegistro({
        email,
        password
      })
    }
  )
}


export function mostrarMensajeLogin(
  mensaje
) {
  const elemento =
    document.querySelector('#auth-mensaje')

  if (elemento) {
    elemento.textContent = mensaje
  }
}