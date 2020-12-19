const Place = require('../models/place');
const Reserva = require('../models/reserva');
const Establecimiento = require('../models/establecimiento');

exports.getIndex = function (req, res) {
  res.render('operador/home');
};

exports.getSuccess = async function (req, res) {
  const idReserva = req.query.idReserva;
  const reserva = await Reserva.findById(idReserva).populate('placeId userId').lean();
  const establecimiento = await Establecimiento.findOne({
    date: reserva.date,
    jornada: reserva.jornada,
  });
  establecimiento.ocupacionActual += reserva.peopleNumber;
  let result = await establecimiento.save();
  let ocupacionActual = result.ocupacionActual;

  if (reserva) {
    res.render('operador/success', { ocupacionActual, reserva });
  }
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
