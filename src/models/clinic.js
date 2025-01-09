'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      clinic.hasMany(models.Doctor, { foreignKey: 'id', targetKey: 'clinicId', as: 'clinicData' })
    }
  }
  clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkDown: DataTypes.TEXT,
    image: DataTypes.BLOB('LONG')
  }, {
    sequelize,
    modelName: 'clinics',
  });
  return clinic;
};