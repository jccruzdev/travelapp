exports.getIndex = function (req, res) {
  res.render('operador/home');
};

exports.getSuccess = function (req, res) {
  res.render('operador/success');
};

exports.getReservaOp = async function (req, res){
  const place = await Place.findOne();
  const destinoId = place._id;
  res.render('operador/reservar',{destinoId});
};
