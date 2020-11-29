let checkboxes = document.querySelectorAll('input[type="checkbox"]');
let csrf = document.querySelector('#_csrf').value;

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', (e) => {
    let id = e.target.dataset.id;
    let state = e.target.checked;
    fetch(`/updateActive/${id}?state="${state}"`, {
      method: 'PUT',
      headers: {
        'csrf-token': csrf,
      },
    })
      .then((result) => {
        console.log('Actualizado STATE');
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
