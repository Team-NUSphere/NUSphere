"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Posts", {
      fields: ["groupId"],
      type: "foreign key",
      name: "fk_post_group",
      references: {
        table: "ForumGroups",
        field: "groupId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Posts", "fk_post_group");
  },
};
