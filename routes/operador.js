const express = require('express');
const operadorController = require('../controllers/operador');

const router = express.Router();

router.get('/operador', operadorController.getIndex);
router.get('/success', operadorController.getSuccess);
router.get('/reservarop', operadorController.getReservaOp);
router.get('/misreservasop',operadorController.getMisReservas);

module.exports = router;
