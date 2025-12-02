const { Household } = require('../models');

exports.listHouseholds = async (req, res) => {
  const households = await Household.findAll({ order: [['id','ASC']] });
  res.json(households);
};

exports.getHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) return res.status(404).json({ message: 'Household not found' });
    res.json(household);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createHousehold = async (req, res) => {
  try {
    const body = req.body;
    if (!body.household_code) return res.status(400).json({ message: 'household_code required' });
    const hh = await Household.create(body);
    res.status(201).json(hh);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) return res.status(404).json({ message: 'Household not found' });
    await household.update(req.body);
    res.json(household);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) return res.status(404).json({ message: 'Household not found' });
    await household.destroy();
    res.json({ message: 'Household deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
