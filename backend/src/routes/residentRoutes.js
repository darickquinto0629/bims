const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/residentController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

router.get('/', ctrl.listResidents);
router.get('/export', ctrl.exportResidents);
router.get('/:id', ctrl.getResident);
router.post('/', ctrl.createResident);
router.put('/:id', ctrl.updateResident);
router.delete('/:id', verifyAdmin, ctrl.deleteResident);

module.exports = router;
