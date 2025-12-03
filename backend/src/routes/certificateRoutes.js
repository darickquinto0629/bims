const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/certificateController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listCertificates);
router.post('/', ctrl.createCertificate);
router.delete('/:id', verifyAdmin, ctrl.deleteCertificate);

module.exports = router;
