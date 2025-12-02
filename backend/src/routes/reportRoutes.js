const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');

router.get('/summary', ctrl.summary);
router.get('/resident-demographics', ctrl.residentDemographics);

module.exports = router;
