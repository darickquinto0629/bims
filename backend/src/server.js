require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const { sequelize } = require('./models');

const householdRoutes = require('./routes/householdRoutes');
const residentRoutes = require('./routes/residentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const blotterRoutes = require('./routes/blotterRoutes');
const officialRoutes = require('./routes/officialRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(bodyParser());

app.use('/api/households', householdRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blotter', blotterRoutes);
app.use('/api/officials', officialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// simple root
app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('DB synced');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
  }
})();
