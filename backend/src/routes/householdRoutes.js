const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/householdController');

router.get('/', ctrl.listHouseholds);
router.post('/', ctrl.createHousehold);

module.exports = router;
