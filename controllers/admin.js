const User = require('../models/user');
const Place = require('../models/place');
const Establecimiento = require('../models/establecimiento');
const Reserva = require('../models/reserva');

const bcrypt = require('bcrypt');

exports.getIndex = async function (req, res) {
  const user = await User.findById(req.session.userId);
  res.render('admin/home', { userActive: user.active });
};

exports.getEditActividad = async function (req, res) {
  const user = await User.findById(req.session.userId).select('place').populate('place');
  const place = user.place;

  if (place) {
    res.render('admin/admin_edit_activ', place);
  } else {
    res.render('admin/admin_edit_activ', { newPlace: true });
  }
};

exports.getEditOcupacion = function (req, res) {
  res.render('admin/admin_edit_ocup');
};

exports.getEditOperador = async function (req, res) {
  const admin = await User.findById(req.session.userId).select('operador').populate('operador');
  const operador = admin.operador;

  if (operador) {
    res.render('admin/admin_edit_oper', { email: operador.email });
  } else {
    res.render('admin/admin_edit_oper', { newOper: true });
  }
};

exports.getEstablecimiento = async function (req, res) {
  try {
    const admin = await User.findById(req.session.userId);
    const establecimientos = await Establecimiento.find({ placeId: admin.place }).lean();
    res.render('admin/establecimiento', { establecimientos });
  } catch (error) {
    console.log(error);
  }
};

exports.getReserva = async function (req, res) {
  try {
    const admin = await User.findById(req.session.userId);
    const reservas = await Reserva.find({ placeId: admin.place }).lean();
    res.render('admin/reserva', { reservas });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditOperador = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password.toLowerCase();

  try {
    const admin = await User.findById(req.session.userId);
    const operadorId = admin.operador;

    //Si  existe un operador actualizarlo, si no , crearlo
    if (operadorId) {
      const operador = await User.findById(operadorId);

      const hashedPassword = await bcrypt.hash(password, 10);
      operador.email = email;
      operador.password = hashedPassword;
      const result = operador.save();

      console.log('OPERADOR ACTUALIZADO');
      res.redirect('/admin');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const operador = new User({
        role: 'operator',
        name: 'operador',
        email: email,
        password: hashedPassword,
      });
      admin.operador = operador._id;

      const result1 = await admin.save();
      const result2 = await operador.save();

      console.log('Asociacion del operador al admin EXITOSA');
      res.redirect('/admin');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postNuevaActividad = async function (req, res) {
  try {
    let { nombre, ocupacion, ubicacion } = req.body;
    let body = req.body;

    //pasar a entero
    ocupacion = Number(body.ocupacion);

    //Verificar dias seleccionados
    let diasTrabajo = [];

    if (body['domingo']) diasTrabajo.push(0);

    if (body['lunes']) diasTrabajo.push(1);

    if (body['martes']) diasTrabajo.push(2);

    if (body['miercoles']) diasTrabajo.push(3);

    if (body['jueves']) diasTrabajo.push(4);

    if (body['viernes']) diasTrabajo.push(5);

    if (body['sabado']) diasTrabajo.push(6);

    //verificar horarios
    const morning = [body.morning1, body.morning2];
    const evening = [body.evening1, body.evening2];

    //Enlazar Lugar a Admin
    const admin = await User.findById(req.session.userId);
    const placeId = admin.place;

    if (placeId) {
      const place = await Place.findById(placeId);

      place.nombre = nombre;
      place.diasTrabajo = diasTrabajo;
      place.morning = morning;
      place.evening = evening;
      place.ocupacion = ocupacion;
      place.ubicacion = ubicacion;

      const result = await place.save();

      console.log('LUGAR ACTUALIZADO CORRECTAMENTE');
      res.redirect('/admin');
    } else {
      const place = new Place({
        nombre,
        diasTrabajo,
        morning,
        evening,
        ocupacion,
        ubicacion,
      });

      //Guardar Lugar
      const result1 = await place.save();
      console.log('LUGAR AGREGADO');

      //Enlazar Lugar a Admin
      const admin = await User.findById(req.session.userId);
      admin.place = result1._id;
      const result2 = await admin.save();
      console.log('LUGAR asociado con ADMIN');
      res.redirect('/admin');
    }
  } catch (error) {
    console.log(error);
  }
};
