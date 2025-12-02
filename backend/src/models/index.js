const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

const db = { sequelize, Sequelize, DataTypes };

// import models
db.Household = require('./household')(sequelize, DataTypes);
db.Resident = require('./resident')(sequelize, DataTypes);
db.Certificate = require('./certificate')(sequelize, DataTypes);
db.Blotter = require('./blotter')(sequelize, DataTypes);
db.Official = require('./official')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.ActivityLog = require('./activityLog')(sequelize, DataTypes);

// associations
db.Household.hasMany(db.Resident, { foreignKey: 'household_id' });
db.Resident.belongsTo(db.Household, { foreignKey: 'household_id' });

db.Resident.hasMany(db.Certificate, { foreignKey: 'resident_id' });
db.Certificate.belongsTo(db.Resident, { foreignKey: 'resident_id' });

db.Resident.hasMany(db.Blotter, { foreignKey: 'resident_id' });
db.Blotter.belongsTo(db.Resident, { foreignKey: 'resident_id' });

module.exports = db;
