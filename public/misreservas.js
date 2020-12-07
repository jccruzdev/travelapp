document.querySelectorAll('.deleteBtn').forEach(function (btn) {
  btn.addEventListener('click', async function (e) {
    try {
      if (!confirm('¿Esta seguro que desea eliminar su reserva?')) {
        return;
      }

      const idReserva = e.target.parentElement.parentElement.parentElement.dataset.id;
      let csrf = document.querySelector('#_csrf').value;

      const res = await fetch(`/reserva/${idReserva}`, {
        method: 'DELETE',
        headers: {
          'csrf-token': csrf,
        },
      });

      const result = await res.json();

      console.log(result);

      e.target.parentElement.parentElement.parentElement.remove();
    } catch (error) {
      console.log(error);
    }
  });
});
