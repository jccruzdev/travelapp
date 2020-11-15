const express = require('express');
const adminController = require('../controllers/user');
// const isAuth = require("../middlewares/isAuth").isAuth;
const { body } = require('express-validator');

const router = express.Router();

router.get('/', adminController.getIndex);

module.exports = router;
