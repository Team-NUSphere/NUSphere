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

export interface PostType {
  details: string;
  likes?: number;
  postId?: string;
  timestamp: Date;
  title: string;
}

interface Post extends BelongsToMixin<ForumGroup, string, "ForumGroup"> {}
interface Post extends BelongsToMixin<User, string, "User"> {}
interface Post extends HasManyMixin<Comment, string, "Reply", "Replies"> {}

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare postId: CreationOptional<string>;
  declare title: string;
  declare details: string;
  declare likes: CreationOptional<number>;
  declare replies: CreationOptional<number>;
  declare views: CreationOptional<number>;

  declare groupId: CreationOptional<string>;
  declare uid: CreationOptional<string>;

  declare ForumGroup?: NonAttribute<ForumGroup>;
  declare User?: NonAttribute<User>;
  declare Replies?: NonAttribute<Comment[]>;
  declare groupName?: NonAttribute<string>;
  declare createdAt: NonAttribute<Date>;

  async getGroupName() {
    this.groupName = (await this.getForumGroup()).groupName;
    return this;
  }

  static associate() {
    Post.belongsTo(ForumGroup, { as: "ForumGroup", foreignKey: "groupId" });
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
          type: DataTypes.UUID,
        },
        likes: {
          allowNull: false,
          defaultValue: 0,
          type: DataTypes.INTEGER,
        },
        postId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
        replies: {
          defaultValue: 0,
          type: DataTypes.INTEGER,
        },
        title: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        uid: {
          type: DataTypes.STRING,
        },
        views: {
          defaultValue: 0,
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
      },
    );

    Post.afterDestroy(async (post, options) => {
      await Comment.destroy({
        transaction: options.transaction,
        where: {
          parentId: post.postId,
          parentType: "ParentPost",
        },
      });
    });
  }
}

export default Post;
