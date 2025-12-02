module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin','staff'), defaultValue: 'staff' },
    full_name: DataTypes.STRING
  }, {
    tableName: 'user',
    underscored: true,
    timestamps: true
  });

  return User;
};
