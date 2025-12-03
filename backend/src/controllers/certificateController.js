const { Certificate, Resident } = require('../models');

exports.listCertificates = async (req, res) => {
  const rows = await Certificate.findAll({ include: [Resident], order: [['issued_at','DESC']] });
  res.json(rows);
};

exports.createCertificate = async (req, res) => {
  try {
    const body = req.body;
    if (!body.resident_id || !body.type) return res.status(400).json({ message: 'resident_id and type required' });
    const cert = await Certificate.create(body);
    res.status(201).json(cert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findByPk(id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    await cert.destroy();
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
