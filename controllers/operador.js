exports.getIndex = function (req, res) {
  res.render('operador/home');
};

exports.getSuccess = function (req, res) {
  res.render('operador/success');
};

exports.getReservaOp = function (req, res){
  res.render('operador/reservar');
};
