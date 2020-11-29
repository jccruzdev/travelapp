const express = require('express');
const operadorController = require('../controllers/operador');

const router = express.Router();

router.get('/operador', operadorController.getIndex);

module.exports = router;
