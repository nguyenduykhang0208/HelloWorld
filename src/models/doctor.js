'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.User, { foreignKey: 'doctorId' })
      Doctor.belongsTo(models.allcodes, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' })
      Doctor.belongsTo(models.allcodes, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceData' })
      Doctor.belongsTo(models.allcodes, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceData' })
      Doctor.belongsTo(models.clinics, { foreignKey: 'clinicId', targetKey: 'id', as: 'clinicData' })
      Doctor.belongsTo(models.specialty, { foreignKey: 'specialtyId', targetKey: 'id', as: 'specialtyData' })
      Doctor.hasMany(models.booking, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorInfoData' })

      Doctor.hasMany(models.Invoice, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorInvoiceData' })
    }
  }
  Doctor.init({
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER,
    html_content: DataTypes.TEXT,
    markdown_content: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};