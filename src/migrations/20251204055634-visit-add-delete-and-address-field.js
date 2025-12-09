'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').Sequelize} Sequelize
     */

    //address for visit location
    await queryInterface.addColumn('visits', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });

    //deleted_at for soft delete
    await queryInterface.addColumn('visits', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface) {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     */
    await queryInterface.removeColumn('visits', 'deleted_at');
    await queryInterface.removeColumn('visits', 'address');
  }
};
