'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      specialtyId: {
        type: Sequelize.INTEGER
      },
      clinicId: {
        type: Sequelize.INTEGER
      },
      priceId: {
        type: Sequelize.STRING
      },
      provinceId: {
        type: Sequelize.STRING
      },
      paymentId: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      count: {
        type: Sequelize.INTEGER
      },
      html_content: {
        type: Sequelize.TEXT
      },
      markdown_content: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Doctors');
  }
};