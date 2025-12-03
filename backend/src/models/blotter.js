module.exports = (sequelize, DataTypes) => {
  const Blotter = sequelize.define('Blotter', {
    resident_id: { type: DataTypes.INTEGER },
    incident_date: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
    reported_by: DataTypes.STRING,
    accommodated_by: DataTypes.STRING,
    status: { type: DataTypes.ENUM('Open','Closed','Pending'), defaultValue: 'Open' }
  }, {
    tableName: 'blotter',
    underscored: true,
    timestamps: true
  });

  return Blotter;
};
