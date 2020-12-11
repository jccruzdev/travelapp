const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const establecimientoSchema = new mongoose.Schema({
  placeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  cupos: {
    type: Number,
    required: true,
  },
  ocupacionActual: {
    type: Number,
    default: 0,
  },
  jornada: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Establecimiento', establecimientoSchema);
