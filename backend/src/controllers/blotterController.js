const { Blotter, Resident } = require('../models');

exports.listBlotters = async (req, res) => {
  const rows = await Blotter.findAll({ include: [Resident], order: [['incident_date','DESC']] });
  res.json(rows);
};

exports.createBlotter = async (req, res) => {
  try {
    const body = req.body;
    const b = await Blotter.create(body);
    res.status(201).json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBlotter = async (req, res) => {
  try {
    const { id } = req.params;
    const blotter = await Blotter.findByPk(id);
    if (!blotter) return res.status(404).json({ message: 'Blotter not found' });
    await blotter.destroy();
    res.json({ message: 'Blotter deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
