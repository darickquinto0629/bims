const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/summary', ctrl.summary);
router.get('/resident-demographics', ctrl.residentDemographics);

module.exports = router;
