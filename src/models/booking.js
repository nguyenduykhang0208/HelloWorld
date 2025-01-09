'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' })
      booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorBookingData' })
      booking.belongsTo(models.allcodes, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeBooking' })
      booking.belongsTo(models.allcodes, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' })
      booking.belongsTo(models.Doctor, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorInfoData' })

      booking.hasOne(models.Invoice, { foreignKey: 'bookingId' })
    }
  }
  booking.init({
    doctorId: DataTypes.INTEGER,
    statusId: DataTypes.STRING,
    patientId: DataTypes.INTEGER,
    birthDay: DataTypes.DATE,
    disease_desc: DataTypes.TEXT,
    email: DataTypes.STRING,
    note: DataTypes.TEXT,
    date_booked: DataTypes.DATE,
    date_booked_stamp: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'booking',
  });
  return booking;
};