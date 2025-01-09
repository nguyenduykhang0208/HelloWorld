'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Invoice.belongsTo(models.Doctor, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorInvoiceData' })
      Invoice.belongsTo(models.Patient, { foreignKey: 'patientId', targetKey: 'patientId', as: 'patientInvoiceData' })
      Invoice.belongsTo(models.booking, { foreignKey: 'bookingId' })
      Invoice.belongsTo(models.allcodes, { foreignKey: 'status', targetKey: 'keyMap', as: 'statusInvoiceData' })
      Invoice.hasMany(models.detail_invoice, { foreignKey: 'invoiceId', targetKey: 'id', as: 'detailInvoice' })
    }
  }
  Invoice.init({
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    bookingId: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    date_stamp_created: DataTypes.STRING,
    status: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};