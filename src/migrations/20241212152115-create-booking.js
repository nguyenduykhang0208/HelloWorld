'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      statusId: {
        type: Sequelize.STRING
      },
      patientId: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      disease_desc: {
        type: Sequelize.TEXT
      },
      note: {
        type: Sequelize.TEXT
      },
      birthDay: {
        type: Sequelize.DATE
      },
      date_booked: {
        type: Sequelize.DATE
      },
      date_booked_stamp: {
        type: Sequelize.STRING
      },
      timeType: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};