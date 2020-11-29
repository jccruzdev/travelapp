const express = require('express');
const sAdminController = require('../controllers/sAdmin');

const router = express.Router();

router.get('/sAdmin', sAdminController.getIndex);
router.post('/addAdmin', sAdminController.postAddAdmin);
router.put('/updateActive/:userId', sAdminController.updateActive);

module.exports = router;
