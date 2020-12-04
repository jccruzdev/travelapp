const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },

  diasTrabajo: {
    type: Schema.Types.Array,
    default: [],
  },
  morning: {
    type: Schema.Types.Array,
    default: [],
  },

  evening: {
    type: Schema.Types.Array,
    default: [],
  },
  ocupacion: {
    type: Number,
    required: true,
  },
  ubicacion: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Place', placeSchema);
