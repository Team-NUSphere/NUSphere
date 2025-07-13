"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostLikes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      postId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Add composite unique constraint
    await queryInterface.addConstraint("PostLikes", {
      fields: ["postId", "uid"],
      type: "unique",
      name: "tt_unique_constraint",
    });

    // Add foreign key constraints
    await queryInterface.addConstraint("PostLikes", {
      fields: ["postId"],
      type: "foreign key",
      name: "fk_postlikes_post",
      references: {
        table: "Posts",
        field: "postId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("PostLikes", {
      fields: ["uid"],
      type: "foreign key",
      name: "fk_postlikes_user",
      references: {
        table: "Users",
        field: "uid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PostLikes");
  },
};
