'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'categories');

    await queryInterface.createTable('products_categories', {
      product_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addIndex('products_categories', ['product_id', 'category_id'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products_categories');

    await queryInterface.addColumn('Products', 'categories', {
      type: Sequelize.JSONB,
      defaultValue: '[]'
    });
  }
};