const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/admin', adminController.getIndex);

router.get('/admin/ocupacion', adminController.getEditOcupacion);
router.get('/admin/actividad', adminController.getEditActividad);
router.get('/admin/operador', adminController.getEditOperador);
router.get('/admin/establecimiento', adminController.getEstablecimiento);
router.get('/admin/reserva', adminController.getReserva);

router.post('/admin/operador', adminController.postEditOperador);
router.post('/admin/actividad', adminController.postNuevaActividad);

module.exports = router;
