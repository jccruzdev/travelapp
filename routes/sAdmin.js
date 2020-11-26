const express = require('express');
const sAdminController = require('../controllers/sAdmin');

const router = express.Router();

router.get('/sAdmin', sAdminController.getIndex);

router.post('/addAdmin', sAdminController.postAddAdmin);

module.exports = router;
