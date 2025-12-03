const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blotterController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listBlotters);
router.post('/', ctrl.createBlotter);
router.delete('/:id', verifyAdmin, ctrl.deleteBlotter);

module.exports = router;
