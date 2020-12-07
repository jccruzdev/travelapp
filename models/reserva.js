const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reservaSchema = new mongoose.Schema({
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  peopleNumber: {
    type: Number,
    required: true,
  },

  jornada: {
    type: String,
    required: true,
  },

  placeId: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  preguntas: {
    type: Object,
    required: true,
  },

  estado: {
    // a-no ha entrado  b-ha entrado c-ha entrado y ya salio
    type: String,
    default: 'a',
  },
});

module.exports = mongoose.model('Reserva', reservaSchema);
