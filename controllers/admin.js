const User = require('../models/user');
const Place = require('../models/place');
const bcrypt = require('bcrypt');

exports.getIndex = function (req, res) {
  res.render('admin/home');
};

exports.getEditDesc = function (req, res) {
  res.render('admin/admin_edit_desc');
};

exports.getEditActividad = function (req, res) {
  console.log(req.session.place);
  if (req.session.place) {
    Place.findOne({ _id: req.session.place })
      .then((place) => {
        res.render('admin/admin_edit_activ', {
          nombre: place.nombre,
          diasTrabajo: place.diasTrabajo,
          morning: place.morning,
          evening: place.evening,
          ocupacion: place.ocupacion,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render('admin/admin_edit_activ', {
      newPlace: true,
      diasTrabajo: [],
      morning: [],
      evening: [],
      ocupacion: [],
    });
  }
};

exports.getEditOcupacion = function (req, res) {
  res.render('admin/admin_edit_ocup');
};

exports.getEditOperador = function (req, res) {
  if (req.session.operador) {
    User.findOne({ _id: req.session.operador })
      .then((operador) => {
        res.render('admin/admin_edit_oper', { email: operador.email });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render('admin/admin_edit_oper', { newAdmin: true });
  }
};

exports.postEditOperador = function (req, res) {
  const email = req.body.email;
  const password = req.body.password.toLowerCase();

  let operadorMongo = undefined;

  User.findOne({ _id: req.session.operador })
    .then((operador) => {
      operadorMongo = operador;
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      operadorMongo.email = email;
      operadorMongo.password = hashedPassword;
      return operadorMongo.save();
    })
    .then((result) => {
      console.log('OPERADOR ACTUALIZADO');
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNuevoOperador = function (req, res) {
  const email = req.body.email;
  const password = req.body.password.toLowerCase();

  let idOperador = undefined;

  //Verificar si usuario existe
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.render('signup', {
          errorMsg: `El usuario ${email} se encuentra registrado`,
          oldInput: {
            email: email,
            password: password,
          },
        });
        return Promise.reject({
          code: 'FUSER',
          msg: 'Usuario ya registrado',
        });
      }

      //Encriptar contraseña
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      const user = new User({
        role: 'operator',
        name: 'operador',
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log('Usuario REGISTRADO');
      //guardar id del operador
      idOperador = result._id;
      //Asociar usuario creado al nuevo operador
      return User.findOne({ _id: req.session.userId });
    })
    .then((admin) => {
      admin.operador = idOperador;
      return admin.save();
    })
    .then((result) => {
      //reset req.session al operador creado
      req.session.operador = result.operador;
      console.log('Asociacion del operador al admin EXITOSA');
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNuevaActividad = function (req, res) {
  const body = req.body;

  //Verificar dias seleccionados
  let diasOp = [];

  if (body['domingo']) {
    diasOp.push(0);
  }
  if (body['lunes']) {
    diasOp.push(1);
  }

  if (body['martes']) {
    diasOp.push(2);
  }

  if (body['miercoles']) {
    diasOp.push(3);
  }
  if (body['jueves']) {
    diasOp.push(4);
  }
  if (body['viernes']) {
    diasOp.push(5);
  }
  if (body['sabado']) {
    diasOp.push(6);
  }

  //obtener nombre del lugar
  let nombre = body.nombre;

  //Obtener horario mañana
  let morning = [body.morning1, body.morning2];

  //Obtener horario tarde
  let evening = [body.evening1, body.evening2];

  //obtener ocupación
  let ocupacion = Number(body.ocupacion);

  //obtener id del administrador del lugar
  let adminId = req.session.userId;

  //guardar placeId
  let placeId = undefined;

  const place = new Place({
    nombre,
    diasTrabajo: diasOp,
    morning,
    evening,
    ocupacion,
  });

  place
    .save()
    .then((place) => {
      console.log('LUGAR AGREGADO');
      placeId = place._id;
      return User.findOne({ _id: adminId });
    })
    .then((admin) => {
      admin.place = placeId;
      //reset place a req.session.place
      req.session.place = placeId;
      return admin.save();
    })
    .then((result) => {
      console.log('PLACE asociado con ADMIN');
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditActividad = function (req, res) {
  const body = req.body;

  //Verificar dias seleccionados
  let diasOp = [];

  if (body['domingo']) {
    diasOp.push(0);
  }
  if (body['lunes']) {
    diasOp.push(1);
  }

  if (body['martes']) {
    diasOp.push(2);
  }

  if (body['miercoles']) {
    diasOp.push(3);
  }
  if (body['jueves']) {
    diasOp.push(4);
  }
  if (body['viernes']) {
    diasOp.push(5);
  }
  if (body['sabado']) {
    diasOp.push(6);
  }

  //obtener nombre del lugar
  let nombre = body.nombre;

  //Obtener horario mañana
  let morning = [body.morning1, body.morning2];

  //Obtener horario tarde
  let evening = [body.evening1, body.evening2];

  //obtener ocupación
  let ocupacion = Number(body.ocupacion);

  //obtener id del lugar
  let placeId = req.session.place;

  Place.findOne({ _id: placeId })
    .then((place) => {
      place.nombre = nombre;
      place.diasTrabajo = diasOp;
      place.morning = morning;
      place.evening = evening;
      place.ocupacion = ocupacion;
      return place.save();
    })
    .then((lugar) => {
      console.log('LUGAR ACTUALIZADO CORRECTAMENTE');
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
    });
};
