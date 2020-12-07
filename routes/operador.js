const express = require('express');
const operadorController = require('../controllers/operador');

const router = express.Router();

router.get('/operador', operadorController.getIndex);
router.get('/success', operadorController.getSuccess);

module.exports = router;
