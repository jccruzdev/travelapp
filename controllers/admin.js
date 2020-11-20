exports.getIndex = function (req, res) {
  res.render('admin/home');
};

exports.getEditDesc = function (req, res) {
  res.render('admin/admin_edit_desc');
};

exports.getEditActividad = function (req, res) {
  res.render('admin/admin_edit_activ');
};

exports.getEditOcupacion = function (req, res) {
  res.render('admin/admin_edit_ocup');
};

exports.getEditOperador = function (req, res) {
  res.render('admin/admin_edit_oper');
};
