const { Resident, Certificate, Blotter, Household } = require('../models');
const { Sequelize } = require('sequelize');

exports.summary = async (req, res) => {
  try {
    const residents = await Resident.count();
    const certificates = await Certificate.count();
    const incidents = await Blotter.count();
    res.json({ residents, certificates, incidents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.residentDemographics = async (req, res) => {
  try {
    const gender = await Resident.findAll({
      attributes: ['gender', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['gender']
    });
    res.json({ gender });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
