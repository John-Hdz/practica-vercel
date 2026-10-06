export function renderAccountSection(name, email) {
  return `
    <section class="account-card card">
      <h2>Mi Cuenta</h2>
      <div class="account-details">
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
      </div>
      <form id="change-password-form" class="password-form">
        <div class="campo">
          <label for="new-password">Nueva contraseña</label>
          <input type="password" id="new-password" placeholder="Ingresa tu nueva contraseña" required>
        </div>
        <button type="submit" class="btn-secundario">Actualizar contraseña</button>
      </form>
      <p id="password-mensaje" class="mensaje"></p>
    </section>
  `
}

export function setupAccountEvents(onCambiarPassword) {
  const form = document.querySelector('#change-password-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const newPassword = document.querySelector('#new-password').value
    onCambiarPassword(newPassword)
  })
}