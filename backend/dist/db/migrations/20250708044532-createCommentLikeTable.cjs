"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CommentLikes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      commentId: {
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
    await queryInterface.addConstraint("CommentLikes", {
      fields: ["commentId", "uid"],
      type: "unique",
      name: "commentLike_tt_unique_constraint",
    });

    // Add foreign key constraints
    await queryInterface.addConstraint("CommentLikes", {
      fields: ["commentId"],
      type: "foreign key",
      name: "fk_commentlikes_comment",
      references: {
        table: "Comments",
        field: "commentId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("CommentLikes", {
      fields: ["uid"],
      type: "foreign key",
      name: "fk_commentlikes_user",
      references: {
        table: "Users",
        field: "uid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CommentLikes");
  },
};
