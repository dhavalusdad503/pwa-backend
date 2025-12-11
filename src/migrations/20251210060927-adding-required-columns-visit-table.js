'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */


    await queryInterface.addColumn('visits', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('visits', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('visits', 'attestation', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    await queryInterface.addColumn('visits', 'client_present', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('visits', 'follow_up', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('visits', 'medication_reviewed', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('visits', 'safety_check', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('visits', 'attestation_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('visits', 'file_path', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('visits', 'latitude');
    await queryInterface.removeColumn('visits', 'longitude');
    await queryInterface.removeColumn('visits', 'attestation');
    await queryInterface.removeColumn('visits', 'client_present');
    await queryInterface.removeColumn('visits', 'follow_up');
    await queryInterface.removeColumn('visits', 'medication_reviewed');
    await queryInterface.removeColumn('visits', 'safety_check');
    await queryInterface.removeColumn('visits', 'attestation_name');
    await queryInterface.removeColumn('visits', 'file_path');
  }
};
