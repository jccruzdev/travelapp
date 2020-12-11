const Place = require('../models/place');
const Reserva = require('../models/reserva');

exports.getIndex = function (req, res) {
  res.render('operador/home');
};

exports.getSuccess = function (req, res) {
  res.render('operador/success');
};

exports.getReservaOp = async function (req, res) {
  const place = await Place.findOne();
  const destinoId = place._id;
  res.render('operador/reservar', { destinoId });
};


exports.getMisReservas = async function (req, res) {
  try {
    const reservas = await Reserva.find({ userId: req.session.userId }).populate('placeId').lean();
    res.render('lugares/misreservas', { reservas });
  } catch (error) {
    console.log(error);
  }
};
