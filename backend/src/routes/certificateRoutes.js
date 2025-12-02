const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/certificateController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listCertificates);
router.post('/', ctrl.createCertificate);

module.exports = router;
