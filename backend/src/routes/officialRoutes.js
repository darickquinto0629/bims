const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/officialController');

router.get('/', ctrl.listOfficials);
router.post('/', ctrl.createOfficial);

module.exports = router;
