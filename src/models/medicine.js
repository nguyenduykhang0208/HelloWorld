'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medicine.hasMany(models.detail_invoice, { foreignKey: 'medicineId', targetKey: 'id', as: 'medicineData' })

    }
  }
  Medicine.init({
    name: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    expire: DataTypes.STRING,
    production_date: DataTypes.STRING,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    image: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Medicine',
  });
  return Medicine;
};