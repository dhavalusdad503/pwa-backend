'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('visits', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      org_id: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'org_id',
        references: {
          model: 'organizations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      caregiver_id: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'caregiver_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      patient_id: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'patient_id',
        references: {
          model: 'patients',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'started_at',
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'ended_at',
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'submitted_at',
      },
      service_type: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'service_type',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'created_at',
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'updated_at',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('visits');
  }
};
