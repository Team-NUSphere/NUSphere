"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SwapRequests", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        unique: true,
      },
      moduleCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lessonType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fromClassNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      toClassNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uid: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "uid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("pending", "fulfilled", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SwapRequests");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_SwapRequests_status";`,
    );
  },
};
