const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blotterController');

router.get('/', ctrl.listBlotters);
router.post('/', ctrl.createBlotter);

module.exports = router;
