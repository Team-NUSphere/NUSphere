/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin, HasManyMixin } from "#db/types/associationtypes.js";
import {
  BelongsToGetAssociationMixinOptions,
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

interface Comment extends BelongsToMixin<Post, string, "ParentPost"> {}
interface Comment extends BelongsToMixin<Comment, string, "ParentComment"> {}
interface Comment extends HasManyMixin<Comment, string, "Reply", "Replies"> {}
interface Comment extends BelongsToMixin<User, string, "Author"> {}

class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  declare commentId: CreationOptional<string>;
  declare comment: string;
  // declare likes: number;

  declare parentId: string;
  declare parentType: "ParentComment" | "ParentPost";

  declare uid: string;

  declare Parent?: NonAttribute<Comment | Post>;
  declare ParentComment?: NonAttribute<Comment>;
  declare ParentPost?: NonAttribute<Post>;
  declare Replies?: NonAttribute<Comment[]>;
  declare Author?: NonAttribute<User>;

  getParent(options?: BelongsToGetAssociationMixinOptions) {
    const mixinMethodName =
      this.parentType === "ParentPost" ? "getParentPost" : "getParentComment";
    return this[mixinMethodName](options);
  }

  static associate() {
    Comment.belongsTo(Comment, {
      as: "ParentComment",
      constraints: false,
      foreignKey: "parentId",
      scope: { parentType: "ParentComment" },
    });
    Comment.hasMany(Comment, {
      as: "Replies",
      constraints: false,
      foreignKey: "parentId",
    });
    Comment.belongsTo(Post, {
      as: "ParentPost",
      constraints: false,
      foreignKey: "parentId",
      scope: { parentType: "ParentPost" },
    });
    Comment.belongsTo(User, { as: "Author", foreignKey: "uid" });
  }

  static initModel(sequelize: Sequelize) {
    Comment.init(
      {
        comment: {
          allowNull: false,
          type: DataTypes.TEXT,
        },
        commentId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
        parentId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        parentType: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        uid: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
      },
    );
    Comment.addHook("afterFind", (findResult) => {
      if (!findResult) return;
      const results: Comment[] = Array.isArray(findResult)
        ? (findResult as Comment[])
        : [findResult as Comment];

      for (const instance of results) {
        if (
          instance.parentType === "ParentPost" &&
          instance.ParentPost !== undefined
        ) {
          instance.Parent = instance.ParentPost;
        } else if (
          instance.parentType === "ParentComment" &&
          instance.ParentComment !== undefined
        ) {
          instance.Parent = instance.ParentComment;
        }
        // To prevent mistakes:
        delete instance.ParentPost;
        delete instance.ParentComment;
      }
    });
  }
}

export default Comment;
