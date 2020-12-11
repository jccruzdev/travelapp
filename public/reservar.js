const picker = document.getElementById('date1');
const placeId = document.querySelectorAll("input[type='hidden']")[1].value;

const getDias = async function () {
  const res = await fetch(`/days/${placeId}`);
  const data = await res.json();

  picker.addEventListener('change', function (e) {
    var day = new Date(this.value).getUTCDay();
    if (!data.diasTrabajo.includes(day)) {
      e.preventDefault();
      this.value = '';
      alert('No hay tours para el día seleccionado! :(');
    }
  });
};

getDias();

//Eliminar mensaje de error (si existe)
const deleteRenderedErrors = function () {
  const renderedError = document.querySelector('.renderedErrors');

  if (renderedError) {
    setTimeout(function () {
      renderedError.remove();
    }, 6000);
  }
};

deleteRenderedErrors();
