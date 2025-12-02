const { Household } = require('../models');

exports.listHouseholds = async (req, res) => {
  const households = await Household.findAll({ order: [['id','ASC']] });
  res.json(households);
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
