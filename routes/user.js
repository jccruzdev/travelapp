const express = require('express');
const userController = require('../controllers/user');
// const isAuth = require("../middlewares/isAuth").isAuth;
const { body } = require('express-validator');

const router = express.Router();

router.get('/', userController.getIndex);
router.get('/about', userController.getAbout);
router.get('/destinos', userController.getDestinos);
router.get('/findelmundo', userController.getFinDelMundo);
router.get('/reservar', userController.getReservar);

module.exports = router;
