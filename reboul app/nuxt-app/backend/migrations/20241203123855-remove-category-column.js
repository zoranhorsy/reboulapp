'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Products');
    if (tableInfo.category) {
      await queryInterface.removeColumn('Products', 'category');
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};