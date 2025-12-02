const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash: hash, full_name, role });
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username }});
    // More specific error messages for UX: username not found vs incorrect password
    if (!user) return res.status(401).json({ message: 'Username not found' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Incorrect password' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user (Admin only)
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    if (!['admin', 'staff'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash: hash, full_name, role });
    res.status(201).json({ id: user.id, username: user.username, role: user.role, full_name: user.full_name });
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, full_name, role, password } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const updates = {};
    if (username && username !== user.username) updates.username = username;
    if (full_name) updates.full_name = full_name;
    if (role && ['admin', 'staff'].includes(role)) updates.role = role;
    if (password) updates.password_hash = await bcrypt.hash(password, 10);
    
    await user.update(updates);
    res.json({ id: user.id, username: user.username, role: user.role, full_name: user.full_name });
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting the last admin
    const adminCount = await User.count({ where: { role: 'admin' } });
    const user = await User.findByPk(id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin' && adminCount === 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin user' });
    }
    
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
