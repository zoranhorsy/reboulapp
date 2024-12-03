'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'categories', {
      type: Sequelize.JSONB,  // Changement du type à JSONB
      allowNull: false,
      defaultValue: []  // Utilisez {} si vous voulez un objet JSON vide par défaut
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'categories', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: []
    });
  }
};