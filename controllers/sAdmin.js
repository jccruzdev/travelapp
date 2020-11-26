exports.getIndex = function (req, res) {
  res.render('sAdmin/home');
};

exports.postAddAdmin = function (req, res) {
  console.log(req.body);
  res.redirect('/sAdmin');
};
