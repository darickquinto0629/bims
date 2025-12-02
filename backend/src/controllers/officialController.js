const { Official } = require('../models');

exports.listOfficials = async (req, res) => {
  const rows = await Official.findAll({ order: [['id','ASC']] });
  res.json(rows);
};

exports.createOfficial = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) return res.status(400).json({ message: 'name required' });
    const o = await Official.create(body);
    res.status(201).json(o);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
