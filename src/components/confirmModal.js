export function mostrarConfirmacion({
  titulo = 'Confirmar acción',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar
}) {
  const modal = document.createElement('div')

  modal.className = 'modal'

  modal.innerHTML = `
    <div class="modal-contenido">

      <h2>${titulo}</h2>

      <p>${mensaje}</p>

      <div class="modal-botones">

        <button
          id="modal-cancelar"
          class="btn-secundario"
        >
          ${textoCancelar}
        </button>

        <button
          id="modal-confirmar"
          class="btn-peligro"
        >
          ${textoConfirmar}
        </button>

      </div>

    </div>
  `

  document.body.appendChild(modal)


  function cerrarModal() {
    modal.remove()
  }


  modal
    .querySelector('#modal-cancelar')
    .addEventListener(
      'click',
      cerrarModal
    )


  modal
    .querySelector('#modal-confirmar')
    .addEventListener(
      'click',
      async () => {

        await onConfirmar()

        cerrarModal()
      }
    )
}