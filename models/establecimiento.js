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
  ocupacion: {
    type: Number,
    required: true,
  },
  jornada: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Establecimiento', establecimientoSchema);
