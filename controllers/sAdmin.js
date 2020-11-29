const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.getIndex = function (req, res) {
  User.find({ role: 'admin' })
    .select('active name')
    .lean()
    .then((admins) => {
      res.render('sAdmin/home', { admins: admins });
    })
    .catch((err) => {});
};

exports.postAddAdmin = function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password.toLowerCase();

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
        role: 'admin',
        active: true,
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log('Usuario REGISTRADO');
      console.log(req.body);
      res.redirect('/sAdmin');
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

exports.updateActive = function (req, res) {
  const userId = req.params.userId;
  let state = req.query.state;

  if (state === '"true"') {
    state = true;
  } else {
    state = false;
  }

  User.findOne({ _id: userId })
    .select('active')
    .then((admin) => {
      admin.active = state;
      return admin.save();
    })
    .then((result) => {
      console.log('ACTIVE ACTUALIZADO');
      res.json({ msg: 'SUCCESS' });
    })
    .catch((err) => {
      console.log(err);
    });
};
