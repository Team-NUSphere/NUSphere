/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import {
  BelongsToManyMixin,
  BelongsToMixin,
  HasManyMixin,
} from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import ForumGroup from "./ForumGroup.js";
import Post from "./Post.js";
import PostTag from "./PostTag.js";

interface Tags extends BelongsToMixin<ForumGroup, string, "Group"> {}
interface Tags
  extends HasManyMixin<PostTag, string, "TagPostTag", "TagPostTags"> {}
interface Tags extends BelongsToManyMixin<Post, string, "Post", "Posts"> {}

class Tags extends Model<InferAttributes<Tags>, InferCreationAttributes<Tags>> {
  declare tagId: CreationOptional<string>;
  declare name: string;
  declare groupId: string;

  declare Group?: NonAttribute<ForumGroup>;
  declare TagPostTags?: NonAttribute<PostTag[]>;
  declare Posts?: NonAttribute<Post[]>;

  static associate() {
    Tags.belongsTo(ForumGroup, {
      as: "Group",
      foreignKey: "groupId",
    });
    Tags.hasMany(PostTag, {
      as: "TagPostTags",
      foreignKey: "tagId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Tags.belongsToMany(Post, {
      as: "Posts",
      foreignKey: "tagId",
      otherKey: "postId",
      through: PostTag,
    });
  }

  static initModel(sequelize: Sequelize) {
    Tags.init(
      {
        groupId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        tagId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
      },
      {
        indexes: [
          {
            fields: ["groupId", "name"],
            name: "tags_groupId_name_unique",
            unique: true,
          },
        ],
        sequelize,
      },
    );
  }
}

export default Tags;
