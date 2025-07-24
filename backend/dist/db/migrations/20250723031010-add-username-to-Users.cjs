"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "username" = "telegramUsername"
      WHERE "username" IS NULL AND "telegramUsername" IS NOT NULL;
    `);

    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "username");
  },
};
