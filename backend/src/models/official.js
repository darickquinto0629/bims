module.exports = (sequelize, DataTypes) => {
  const Official = sequelize.define('Official', {
    name: { type: DataTypes.STRING, allowNull: false },
    position: DataTypes.STRING,
    term_start: DataTypes.DATEONLY,
    term_end: DataTypes.DATEONLY,
    contact: DataTypes.STRING
  }, {
    tableName: 'official',
    underscored: true,
    timestamps: true
  });

  return Official;
};
