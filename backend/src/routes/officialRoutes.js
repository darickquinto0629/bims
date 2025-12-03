const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/officialController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listOfficials);
router.get('/:id', ctrl.getOfficial);
router.post('/', ctrl.createOfficial);
router.put('/:id', ctrl.updateOfficial);
router.delete('/:id', verifyAdmin, ctrl.deleteOfficial);

module.exports = router;
