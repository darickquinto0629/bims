const { Official } = require('../models');

exports.listOfficials = async (req, res) => {
  const rows = await Official.findAll({ order: [['id','ASC']] });
  res.json(rows);
};

exports.getOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const official = await Official.findByPk(id);
    if (!official) return res.status(404).json({ message: 'Official not found' });
    res.json(official);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
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

exports.updateOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const official = await Official.findByPk(id);
    if (!official) return res.status(404).json({ message: 'Official not found' });
    await official.update(req.body);
    res.json(official);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const official = await Official.findByPk(id);
    if (!official) return res.status(404).json({ message: 'Official not found' });
    await official.destroy();
    res.json({ message: 'Official deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
