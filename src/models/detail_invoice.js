'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      detail_invoice.belongsTo(models.Invoice, { foreignKey: 'invoiceId', targetKey: 'id', as: 'detailInvoice' })
      detail_invoice.belongsTo(models.Medicine, { foreignKey: 'medicineId', targetKey: 'id', as: 'medicineData' })

    }
  }
  detail_invoice.init({
    invoiceId: DataTypes.INTEGER,
    medicineId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'detail_invoice',
  });
  return detail_invoice;
};