module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
    resident_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    issued_by: DataTypes.STRING,
    remarks: DataTypes.TEXT
  }, {
    tableName: 'certificate',
    underscored: true,
    timestamps: true
  });

  return Certificate;
};
