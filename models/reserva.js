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

  q1: {
    type: String,
  },
  q2: {
    type: String,
  },
  q3: {
    type: String,
  },
});

module.exports = mongoose.model('Reserva', reservaSchema);
