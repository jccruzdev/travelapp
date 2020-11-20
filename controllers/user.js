exports.getIndex = function (req, res) {
  res.render('home', { path: '/' });
};

exports.getAbout = function (req, res) {
  res.render('about');
};

exports.getDestinos = function (req, res) {
  res.render('lugares/destinos');
};

exports.getFinDelMundo = function (req, res) {
  res.render('lugares/descripcion-fdm');
};

exports.getReservar = function (req, res) {
  res.render('lugares/reservar');
};
