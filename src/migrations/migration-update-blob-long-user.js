'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.BLOB('long'),
                allowNull: true
            })
        ])
    },
    async down(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.BLOB,
                allowNull: true
            })
        ])
    },
};