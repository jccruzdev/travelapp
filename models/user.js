const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    default: 'tourist',
  },
  active: {
    type: Boolean,
  },

  operador: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
  },

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
