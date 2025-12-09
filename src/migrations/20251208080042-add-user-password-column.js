"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "reset_pass_token", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "reset_pass_token");
  },
};
