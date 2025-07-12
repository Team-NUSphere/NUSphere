/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
  Sequelize,
} from "sequelize";

import Comment from "./Comment.js";
import User from "./User.js";

interface CommentLikes extends BelongsToMixin<User, string, "User"> {}
interface CommentLikes extends BelongsToMixin<Comment, string, "Comment"> {}

class CommentLikes extends Model<
  InferAttributes<CommentLikes>,
  InferCreationAttributes<CommentLikes>
> {
  declare id: CreationOptional<string>;

  declare commentId: CreationOptional<string>;
  declare uid: CreationOptional<string>;

  declare User?: NonAttribute<User>;
  declare Comment?: NonAttribute<Comment>;

  static async addNewLike(uid: string, commentId: string) {
    return await CommentLikes.findOrCreate({
      defaults: {
        commentId: commentId,
        uid: uid,
      },
      where: {
        [Op.and]: [{ commentId: commentId }, { uid: uid }],
      },
    });
  }

  static async unlike(uid: string, commentId: string) {
    const commentLikes = await CommentLikes.findOne({
      where: {
        [Op.and]: [{ commentId: commentId }, { uid: uid }],
      },
    });
    if (!commentLikes) return;
    await commentLikes.destroy();
  }

  static associate() {
    CommentLikes.belongsTo(User, {
      as: "User",
      foreignKey: "uid",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CommentLikes.belongsTo(Comment, {
      as: "Comment",
      foreignKey: "commentId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    CommentLikes.init(
      {
        commentId: {
          allowNull: false,
          type: DataTypes.UUID,
          unique: "commentLike_tt_unique_constraint",
        },
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        uid: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: "commentLike_tt_unique_constraint",
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default CommentLikes;
