const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/officialController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listOfficials);
router.post('/', ctrl.createOfficial);

module.exports = router;
