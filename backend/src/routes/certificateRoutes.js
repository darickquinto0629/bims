const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/certificateController');

router.get('/', ctrl.listCertificates);
router.post('/', ctrl.createCertificate);

module.exports = router;
