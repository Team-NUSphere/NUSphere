"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("Posts", "aiCache", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Posts", "aiCacheUpdated", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      }),
      queryInterface.addColumn("ForumGroups", "aiCache", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("ForumGroups", "aiCacheUpdated", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("Posts", "aiCache"),
      queryInterface.removeColumn("Posts", "aiCacheUpdated"),
      queryInterface.removeColumn("ForumGroups", "aiCache"),
      queryInterface.removeColumn("ForumGroups", "aiCacheUpdated"),
    ]);
  },
};
