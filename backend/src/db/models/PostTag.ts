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

import Post from "./Post.js";
import Tags from "./Tags.js";

interface PostTag extends BelongsToMixin<Tags, string, "Tag"> {}
interface PostTag extends BelongsToMixin<Post, string, "Post"> {}

class PostTag extends Model<
  InferAttributes<PostTag>,
  InferCreationAttributes<PostTag>
> {
  declare id: CreationOptional<string>;

  declare tagId: CreationOptional<string>;
  declare postId: CreationOptional<string>;

  declare Tag?: NonAttribute<Tags>;
  declare Post?: NonAttribute<Post>;

  static async addNewTag(tagId: string, postId: string) {
    return await PostTag.findOrCreate({
      defaults: {
        postId: postId,
        tagId: tagId,
      },
      where: {
        [Op.and]: [{ postId: postId }, { tagId: tagId }],
      },
    });
  }

  static associate() {
    PostTag.belongsTo(Tags, {
      as: "Tag",
      foreignKey: "tagId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PostTag.belongsTo(Post, {
      as: "Post",
      foreignKey: "postId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    PostTag.init(
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
        },
        tagId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
      },
      {
        indexes: [
          {
            fields: ["postId", "tagId"],
            name: "postTag_tt_unique_constraint",
            unique: true,
          },
        ],
        sequelize,
      },
    );
  }
}

export default PostTag;
