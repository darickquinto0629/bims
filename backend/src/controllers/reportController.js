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

exports.monthlyIncidents = async (req, res) => {
  try {
    const incidents = await Blotter.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('incident_date'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('incident_date'), '%Y-%m')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('incident_date'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Generate all months for the current year
    const currentYear = new Date().getFullYear();
    const allMonths = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthStr = `${currentYear}-${String(month).padStart(2, '0')}`;
      const existing = incidents.find(i => i.month === monthStr);
      allMonths.push({
        month: monthStr,
        count: existing ? parseInt(existing.count) : 0
      });
    }

    res.json(allMonths);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
