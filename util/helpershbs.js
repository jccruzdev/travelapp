const moment = require('moment');
moment.locale('es');

module.exports = {
  compareDay(diasTrabajo, dia) {
    let found = diasTrabajo.some((diaTrab) => diaTrab === dia);
    if (found) {
      return 'checked';
    } else {
      return '';
    }
  },
  compareJornada(jornada) {
    if (jornada === 'morning') {
      return 'Mañana';
    } else {
      return 'Tarde';
    }
  },

  compareFecha(date) {
    const newDate = moment(date).format('LL');
    return newDate;
  },

  compareHora(jornada, morning, evening) {
    if (jornada === 'morning') {
      return `${morning[0]}-${morning[1]}`;
    } else {
      return `${evening[0]}-${evening[1]}`;
    }
  },

  switch(value, options) {
    this.switch_value = value;
    return options.fn(this);
  },
  case(value, options) {
    if (value == this.switch_value) {
      return options.fn(this);
    }
  },
};
