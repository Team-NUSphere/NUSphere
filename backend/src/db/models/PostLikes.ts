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
  Sequelize,
} from "sequelize";

import Post from "./Post.js";
import User from "./User.js";

interface PostLikes extends BelongsToMixin<User, string, "User"> {}
interface PostLikes extends BelongsToMixin<Post, string, "Post"> {}

class PostLikes extends Model<
  InferAttributes<PostLikes>,
  InferCreationAttributes<PostLikes>
> {
  declare id: CreationOptional<string>;

  declare postId: CreationOptional<string>;
  declare uid: CreationOptional<string>;

  declare User?: NonAttribute<User>;
  declare Post?: NonAttribute<Post>;

  static associate() {
    PostLikes.belongsTo(User, {
      as: "User",
      foreignKey: "uid",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PostLikes.belongsTo(Post, {
      as: "Post",
      foreignKey: "postId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    PostLikes.init(
      {
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        postId: {
          allowNull: false,
          type: DataTypes.UUID,
          unique: "tt_unique_constraint",
        },
        uid: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: "tt_unique_constraint",
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default PostLikes;
