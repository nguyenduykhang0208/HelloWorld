'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.hasMany(models.Invoice, { foreignKey: 'id', targetKey: 'patientId', as: 'patientInvoiceData' })
      Patient.belongsTo(models.User, { foreignKey: 'patientId' })
    }
  }
  Patient.init({
    patientId: DataTypes.INTEGER,
    phoneNumber2: DataTypes.STRING,
    birthDay: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};