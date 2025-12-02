module.exports = (sequelize, DataTypes) => {
  const Household = sequelize.define('Household', {
    household_code: { type: DataTypes.STRING, unique: true, allowNull: false },
    address_line: DataTypes.STRING,
    barangay: DataTypes.STRING,
    city_municipality: DataTypes.STRING,
    province: DataTypes.STRING,
    postal_code: DataTypes.STRING
  }, {
    tableName: 'household',
    underscored: true,
    timestamps: true
  });

  return Household;
};
