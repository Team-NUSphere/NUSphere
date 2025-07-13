"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "ForumGroups" DROP CONSTRAINT "ForumGroups_pkey";
    `);
    await queryInterface.changeColumn("ForumGroups", "groupId", {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ForumGroups", "groupId", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "ForumGroups" ADD PRIMARY KEY ("id")`);
  },
};
