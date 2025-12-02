const { Resident, Household } = require('../models');
const { Op } = require('sequelize');

exports.listResidents = async (req, res) => {
  try {
    const { page = 1, pageSize = 50, q } = req.query;
    const where = {};
    if (q) {
      where[Op.or] = [
        { first_name: { [Op.substring]: q } },
        { last_name: { [Op.substring]: q } }
      ];
    }
    const result = await Resident.findAndCountAll({
      where,
      include: [{ model: Household }],
      limit: parseInt(pageSize),
      offset: (parseInt(page)-1) * parseInt(pageSize),
      order: [['last_name','ASC']]
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResident = async (req, res) => {
  try {
    const r = await Resident.findByPk(req.params.id, { include: [Household] });
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createResident = async (req, res) => {
  try {
    const body = req.body;
    if (!body.first_name || !body.last_name) return res.status(400).json({ message: 'first_name and last_name required' });
    const r = await Resident.create(body);
    res.status(201).json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResident = async (req, res) => {
  try {
    const r = await Resident.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    await r.update(req.body);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResident = async (req, res) => {
  try {
    const r = await Resident.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    await r.destroy();
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const stringify = require('csv-stringify').stringify; // if not imported yet

exports.exportResidents = async (req, res) => {
  try {
    const rows = await Resident.findAll({ include: [Household] });

    const data = rows.map(r => ({
      id: r.id,
      first_name: r.first_name,
      last_name: r.last_name,
      birth_date: r.birth_date,
      gender: r.gender,
      civil_status: r.civil_status,
      contact_number: r.contact_number,
      email: r.email,
      household: r.Household ? r.Household.household_code : ""
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="residents.csv"');

    stringify(data, { header: true }).pipe(res);

  } catch (err) {
    console.error('exportResidents error:', err);
    res.status(500).json({ message: 'Export failed' });
  }
};
