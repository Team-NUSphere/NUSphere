"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MatchedRequests", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        unique: true,
      },
      requestId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "SwapRequests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cycleId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "SwapCycles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      position: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fromClassNo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      toClassNo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MatchedRequests");
  },
};
