const Place = require('../models/place');
const Reserva = require('../models/reserva');
const qrcode = require('qrcode');

const moment = require('moment');
moment.locale('es');

exports.getIndex = function (req, res) {
  res.render('home');
};

exports.getAbout = function (req, res) {
  res.render('about');
};

exports.getDestinos = async function (req, res) {
  try {
    const destinos = await Place.find().lean();
    res.render('lugares/destinos', { destinos });
  } catch (error) {
    console.log(error);
  }
};

exports.getMisReservas = async function (req, res) {
  try {
    const reservas = await Reserva.find({ userId: req.session.userId }).populate('placeId').lean();
    res.render('lugares/misreservas', { reservas });
  } catch (error) {
    console.log(error);
  }
};

exports.getQR = function (req, res) {
  const idReserva = req.params.idReserva;
  qrcode.toFile(
    `images/reserva-${idReserva}.png`,
    `${idReserva}`,
    {
      color: {
        dark: '#000', // Blue dots
        light: '#fff', // Transparent background
      },
    },
    function (err) {
      if (err) throw err;
      res.render('lugares/qr', { idReserva });
    }
  );
};

exports.getFinDelMundo = function (req, res) {
  const destinoId = req.params.destinoId;
  res.render('lugares/descripcion-fdm', { destinoId });
};

exports.getReservar = function (req, res) {
  const placeId = req.query.placeId;
  const jornada = req.query.jornada;
  res.render('lugares/reservar', { placeId: placeId, jornada: jornada });
};

exports.postReservar = async function (req, res) {
  let { date, peopleNumber, placeId, jornada, q1, q2, q3 } = req.body;
  const userId = req.session.userId;

  //formatear placeId - porque genera un espacio adicional al final del string
  placeId = placeId.trim();

  //Formatear Fecha
  const year = date.split('-')[0];
  const month = date.split('-')[1];
  const day = date.split('-')[2];
  date = new Date(year, month, day);

  //Establecer a off cuando no se marca la casilla
  if (!q1) q1 = 'off';
  if (!q2) q2 = 'off';
  if (!q3) q3 = '';

  const reserva = new Reserva({
    date,
    peopleNumber,
    jornada,
    placeId,
    userId,
    q1,
    q2,
    q3,
  });

  try {
    const result = await reserva.save();
    console.log('RESERVA GUARDADA');
    res.redirect('/misreservas');
  } catch (error) {
    console.log(error);
  }
};

exports.deleteReserva = async function (req, res) {
  const idReserva = req.params.idReserva;
  const result = await Reserva.findByIdAndDelete(idReserva);
  res.json({ msg: 'Reserva Eliminada', result });
};

exports.getDays = async function (req, res) {
  const placeId = req.params.placeId;

  try {
    const place = await Place.findById(placeId).select('diasTrabajo');
    res.json({ diasTrabajo: [...place.diasTrabajo] });
  } catch (error) {
    console.log(error);
  }
};
