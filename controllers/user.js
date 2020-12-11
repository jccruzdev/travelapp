const Place = require('../models/place');
const Reserva = require('../models/reserva');
const Establecimiento = require('../models/establecimiento');

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

  req.session.placeId = placeId;
  req.session.jornada = jornada;

  res.render('lugares/reservar', { placeId: placeId, jornada: jornada });
};

exports.postReservar = async function (req, res) {
  let { date, peopleNumber, q1, q2, q3 } = req.body;
  const userId = req.session.userId;
  const placeId = req.session.placeId;
  const jornada = req.session.jornada;

  //obtener fecha
  date = new Date(date);
  date.setUTCHours(15);

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
    preguntas: { q1, q2, q3 },
  });
  try {
    const place = await Place.findById(placeId);
    let est = await Establecimiento.findOne({ date, jornada });

    if (est && est.cupos == 0) {
      return res.render('lugares/reservar', {
        errorMsg: `Ya no quedan cupos para el ${moment(est.date).format('LL')}`,
      });
    }

    if (est && peopleNumber > est.cupos) {
      return res.render('lugares/reservar', {
        errorMsg: `No puedes reservar para mas de ${est.cupos} personas el ${moment(
          est.date
        ).format('LL')}`,
      });
    }

    //verificar que no se exceda el cupo maximo
    if (place && peopleNumber > place.ocupacion) {
      return res.render('lugares/reservar', {
        errorMsg: `No puedes reservar para mas de ${place.ocupacion} personas en este establecimiento`,
      });
    }
    const result = await reserva.save();
    console.log('RESERVA GUARDADA');

    //[GENERAR ESTABLECIMIENTO]
    if (!est) {
      //Generar establecimiento:
      est = new Establecimiento({
        placeId: result.placeId,
        date: result.date,
        cupos: place.ocupacion - result.peopleNumber,
        jornada: result.jornada,
      });
      const result2 = await est.save();
      console.log('ESTABLECIMIENTO CREADO Y ACTUALIZADO');
    } else {
      est.cupos = est.cupos - result.peopleNumber;
      const result2 = await est.save();
      console.log('ESTABLECIMIENTO ACTUALIZADO');
    }
    res.redirect('/misreservas');
  } catch (error) {
    console.log(error);
  }
};

exports.deleteReserva = async function (req, res) {
  //Eliminar Reserva
  const idReserva = req.params.idReserva;
  const result = await Reserva.findByIdAndDelete(idReserva);

  //Eliminar ocupacion del establecimiento
  const result2 = await Establecimiento.findOne({
    date: result.date,
    jornada: result.jornada,
  });
  result2.cupos = result2.cupos + result.peopleNumber;
  const result3 = await result2.save();

  //Enviar Response
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
