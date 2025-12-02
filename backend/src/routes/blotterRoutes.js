const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blotterController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.listBlotters);
router.post('/', ctrl.createBlotter);

module.exports = router;
