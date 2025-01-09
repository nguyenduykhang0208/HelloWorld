'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.allcodes, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      User.belongsTo(models.allcodes, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })

      User.hasOne(models.Doctor, { foreignKey: 'doctorId' })
      User.hasOne(models.Patient, { foreignKey: 'patientId' })

      User.hasMany(models.schedules, { foreignKey: 'id', targetKey: 'doctorId', as: 'doctorData' })
      User.hasMany(models.booking, { foreignKey: 'id', targetKey: 'patientId', as: 'patientData' })
      User.hasMany(models.booking, { foreignKey: 'id', targetKey: 'doctorId', as: 'doctorBookingData' })
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.BLOB,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};