const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const crypto = require('crypto');
const user = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('login', {
    path: '/login',
    validationErrors: [],
    errorMsg: '',
    oldInput: {
      email: '',
      password: '',
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.render('login', {
      validationErrors: errors.array(),
      errorMsg: '',
      oldInput: {
        email: email,
        password: password,
      },
    });
  }

  let userFound;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //TODO: devolver pagina de usuario no encontrado
        console.log('Usuario no encontrado');
        res.render('login', {
          validationErrors: [],
          errorMsg: 'Usuario no encontrado',
          oldInput: {
            email: email,
            password: password,
          },
        });
        return Promise.reject({
          code: 'NOTFUSER',
          msg: 'Usuario No Encontrado',
        });
      }
      userFound = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        console.log('La contraseña no coincide');
        return res.render('login', {
          validationErrors: [],
          errorMsg: 'La contraseña no coincide',
          oldInput: {
            email: email,
            password: password,
          },
        });
      }

      req.session.userId = userFound._id;
      req.session.userRole = userFound.role;
      req.session.active = userFound.active;
      req.session.isLoggedIn = true;
      req.session.operador = userFound.operador;
      req.session.place = userFound.place;

      res.redirect('/');
    })
    .catch((err) => {
      if (err.code === 'NOTFUSER') {
        console.log(err);
      } else {
        const error = new Error(err);
        next(error);
      }
    });
};

exports.getSignUp = (req, res, next) => {
  res.render('signup', {
    path: '/signup',
    validationErrors: [],
    errorMsg: '',
    oldInput: {
      email: '',
      password: '',
    },
  });
};

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password.toLowerCase();
  const confirmPassword = req.body.confirmPassword.toLowerCase();
  const errors = validationResult(req);

  //verificar errores de validacion
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.render('signup', {
      validationErrors: errors.array(),
      errorMsg: '',
      oldInput: {
        email: email,
        password: password,
      },
    });
  }

  //Comparar campos contraseñas
  if (password !== confirmPassword) {
    return res.render('signup', {
      validationErrors: [],
      errorMsg: 'Las contraseñas no coinciden',
      oldInput: {
        email: email,
        password: password,
      },
    });
  }

  //Verificar si usuario existe
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.render('signup', {
          validationErrors: [],
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
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log('Usuario REGISTRADO');
      res.redirect('/login');
    })
    .catch((err) => {
      if (err.code === 'FUSER') {
        console.log(err);
      } else {
        const error = new Error(err);
        next(error);
      }
    });
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return console.log('La sesion actual no pudo ser eliminada');
    }
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('reset', {
    validationErrors: [],
    errorMsg: '',
    oldInput: {
      email: '',
    },
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  //Generar TOKEN
  crypto.randomBytes(15, function (err, buffer) {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    //Buscar Usuario
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          res.render('reset', {
            validationErrors: [],
            errorMsg: 'El usuario no tiene una cuenta en el sistema',
            oldInput: {
              email: email,
            },
          });
          return Promise.reject({
            code: 'NOTFACCOUNT',
            msg: 'No Existe la cuenta de correo',
          });
        }
        //TODO: logica existe usuario
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 60 * 60 * 1000; //+1Hr

        const text = `Con el siguiente enlace podra cambiar su contraseña: http://localhost:3000/reset/${token},
        solo estará disponible por 1 hora para efectuar los cambios necesarios`;
        console.log(text);
        return user.save();
      })
      .then((result) => {
        res.render('reset', {
          validationErrors: [],
          errorMsg: '',
          infoMsg: `Se ha enviado un correo a ${result.email}, por favor revise.`,
          oldInput: {
            email: email,
          },
        });
      })
      .catch((err) => {
        if (err.code === 'NOTFACCOUNT') {
          console.log(err);
        } else {
          const error = new Error(err);
          next(error);
        }
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token })
    .then((user) => {
      if (!user) {
        return res.redirect('/', 403);
      }
      res.render('newPassword', {
        validationErrors: [],
        errorMsg: '',
        infoMsg: 'Felicidades, ya puede cambiar su contraseña',
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.resetToken;

  let resetUser;

  User.findOne({ _id: userId, resetToken: token })
    .then((user) => {
      if (!user) {
        return res.redirect('/', 402);
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 10);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpires = undefined;
      return resetUser.save();
    })
    .then((result) => {
      console.log('Operacion realizada exitosamente ', result.email);
      res.render('home', { isLoggedIn: req.session.isLoggedIn });
    })
    .catch((err) => {
      console.log(err);
    });
};
