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
      },
      fromClassId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Classes",
          key: "classId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      toClassId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Classes",
          key: "classId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_SwapRequests_status";`,
    );
    await queryInterface.dropTable("SwapRequests");
  },
};
