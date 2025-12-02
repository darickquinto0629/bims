const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/residentController');

router.get('/', ctrl.listResidents);
router.get('/export', ctrl.exportResidents);
router.post('/', ctrl.createResident);
router.get('/:id', ctrl.getResident);
router.put('/:id', ctrl.updateResident);
router.delete('/:id', ctrl.deleteResident);

module.exports = router;
