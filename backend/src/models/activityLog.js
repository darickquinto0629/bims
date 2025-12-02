module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    action: DataTypes.STRING,
    entity: DataTypes.STRING,
    entity_id: DataTypes.INTEGER,
    performed_by: DataTypes.STRING,
    data: DataTypes.JSON
  }, {
    tableName: 'activity_log',
    underscored: true,
    timestamps: true
  });

  return ActivityLog;
};
