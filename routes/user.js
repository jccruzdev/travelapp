const express = require('express');
const userController = require('../controllers/user');
// const isAuth = require("../middlewares/isAuth").isAuth;
const { body } = require('express-validator');

const router = express.Router();

router.get('/', userController.getIndex);
router.get('/about', userController.getAbout);
router.get('/destinos', userController.getDestinos);
router.get('/misreservas', userController.getMisReservas);
router.get('/findelmundo', userController.getFinDelMundo);
router.get('/reservar', userController.getReservar);
router.get('/qr/:idReserva', userController.getQR);

router.post('/reservar', userController.postReservar);

//Async requests
router.get('/days/:placeId', userController.getDays);

module.exports = router;
