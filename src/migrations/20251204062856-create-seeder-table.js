"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SequelizeData", {
      name: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      executed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SequelizeData");
  },
};
