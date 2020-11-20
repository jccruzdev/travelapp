const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/admin', adminController.getIndex);
router.get('/admin/descripcion', adminController.getEditDesc);
router.get('/admin/actividad', adminController.getEditActividad);
router.get('/admin/ocupacion', adminController.getEditOcupacion);
router.get('/admin/operador', adminController.getEditOperador);

module.exports = router;
