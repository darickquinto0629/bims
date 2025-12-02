const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/householdController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listHouseholds);
router.post('/', ctrl.createHousehold);
router.get('/:id', ctrl.getHousehold);
router.put('/:id', ctrl.updateHousehold);
router.delete('/:id', ctrl.deleteHousehold);

module.exports = router;
