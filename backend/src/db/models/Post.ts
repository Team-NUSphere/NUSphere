/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin, HasManyMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import Comment from "./Comment.js";
import ForumGroup from "./ForumGroup.js";
import User from "./User.js";

interface Post extends BelongsToMixin<ForumGroup, string, "ForumGroup"> {}
interface Post extends BelongsToMixin<User, string, "User"> {}
interface Post extends HasManyMixin<Comment, string, "Reply", "Replies"> {}

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare postId: CreationOptional<string>;
  declare title: string;
  declare details: string;
  // declare likes: number;

  declare groupId: CreationOptional<string>;
  declare uid: CreationOptional<string>;

  declare ForumGroup?: NonAttribute<ForumGroup>;
  declare User?: NonAttribute<User>;
  declare Replies?: NonAttribute<Comment[]>;

  static associate() {
    Post.belongsTo(ForumGroup, { as: "ForumGroup", foreignKey: "groupid" });
    Post.belongsTo(User, { as: "User", foreignKey: "uid" });
    Post.hasMany(Comment, {
      as: "Replies",
      constraints: false,
      foreignKey: "parentId",
      scope: { parentType: "ParentPost" },
    });
  }

  static initModel(sequelize: Sequelize) {
    Post.init(
      {
        details: {
          type: DataTypes.TEXT,
        },
        groupId: {
          type: DataTypes.STRING,
        },
        postId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          type: DataTypes.UUID,
        },
        title: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        uid: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default Post;
