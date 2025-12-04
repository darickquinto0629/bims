module.exports = (sequelize, DataTypes) => {
  const Resident = sequelize.define('Resident', {
    household_id: { type: DataTypes.INTEGER, allowNull: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    middle_name: DataTypes.STRING,
    last_name: { type: DataTypes.STRING, allowNull: false },
    suffix: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY,
    address: DataTypes.STRING,
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), defaultValue: 'Male' },
    civil_status: { type: DataTypes.ENUM('Single','Married','Widowed','Separated','Divorced','Other'), defaultValue: 'Single' },
    occupation: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    email: DataTypes.STRING,
    national_id: DataTypes.STRING,
    voter_status: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_head: { type: DataTypes.BOOLEAN, defaultValue: false },
    remarks: DataTypes.TEXT,
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'resident',
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Resident;
};
