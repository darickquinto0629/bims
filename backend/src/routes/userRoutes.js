const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

// Protected routes (Admin only)
router.get('/', verifyToken, verifyAdmin, ctrl.getAllUsers);
router.post('/', verifyToken, verifyAdmin, ctrl.createUser);
router.get('/:id', verifyToken, verifyAdmin, ctrl.getUser);
router.put('/:id', verifyToken, verifyAdmin, ctrl.updateUser);
router.delete('/:id', verifyToken, verifyAdmin, ctrl.deleteUser);

module.exports = router;
