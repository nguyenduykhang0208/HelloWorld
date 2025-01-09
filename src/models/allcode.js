'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
      allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      allcode.hasMany(models.schedules, { foreignKey: 'timeType', as: 'timeTypeData' })
      allcode.hasMany(models.Doctor, { foreignKey: 'priceId', as: 'priceData' })
      allcode.hasMany(models.Doctor, { foreignKey: 'paymentId', as: 'paymentData' })
      allcode.hasMany(models.Doctor, { foreignKey: 'provinceId', as: 'provinceData' })
      allcode.hasMany(models.booking, { foreignKey: 'timeType', as: 'timeTypeBooking' })
      allcode.hasMany(models.booking, { foreignKey: 'statusId', as: 'statusData' })
      allcode.hasMany(models.Invoice, { foreignKey: 'status', as: 'statusInvoiceData' })


    }
  }
  allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    value_vi: DataTypes.STRING,
    value_en: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'allcodes',
  });
  return allcode;
};