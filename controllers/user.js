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

exports.getDestinos = function (req, res) {
  Place.find()
    .lean()
    .then((lugares) => {
      console.log(lugares);
      res.render('lugares/destinos');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMisReservas = function (req, res) {
  Reserva.find({ userId: req.session.userId })
    .populate('placeId')
    .lean()
    .then((reservas) => {
      res.render('lugares/misreservas', { reservas });
    })
    .catch((err) => {
      console.log(err);
    });
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
  res.render('lugares/descripcion-fdm');
};

exports.getReservar = function (req, res) {
  const placeId = req.query.placeId;
  const jornada = req.query.jornada;
  res.render('lugares/reservar', { placeId: placeId, jornada: jornada });
};

exports.postReservar = function (req, res) {
  let { date, peopleNumber, jornada, placeId, q1, q2, q3 } = req.body;
  const userId = req.session.userId;

  //Fecha
  const year = date.split('-')[0];
  const month = date.split('-')[1];
  const day = date.split('-')[2];

  date = new Date(year, month, day);

  if (!q1) {
    q1 = 'off';
  }

  if (!q2) {
    q2 = 'off';
  }

  if (!q3) {
    q3 = 'off';
  }

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

  reserva
    .save()
    .then((reserva) => {
      res.redirect('/misreservas');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDays = function (req, res) {
  const placeId = req.params.placeId;

  Place.findOne({ _id: placeId })
    .select('diasTrabajo')
    .then((place) => {
      res.json({ diasTrabajo: [...place.diasTrabajo] });
    })
    .catch((err) => {
      console.log(err);
    });
};
