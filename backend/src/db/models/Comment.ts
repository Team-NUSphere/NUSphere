/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import {
  BelongsToManyMixin,
  BelongsToMixin,
  HasManyMixin,
} from "#db/types/associationtypes.js";
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

import CommentLikes from "./CommentLikes.js";
import Post from "./Post.js";
import User from "./User.js";

interface Comment extends BelongsToMixin<Post, string, "ParentPost"> {}
interface Comment extends BelongsToMixin<Comment, string, "ParentComment"> {}
interface Comment extends HasManyMixin<Comment, string, "Reply", "Replies"> {}
interface Comment extends BelongsToMixin<User, string, "Author"> {}
interface Comment
  extends HasManyMixin<
    CommentLikes,
    string,
    "CommentCommentLike",
    "CommentCommentLikes"
  > {}
interface Comment
  extends BelongsToManyMixin<User, string, "CommentLiker", "CommentLikers"> {}

class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  declare commentId: CreationOptional<string>;
  declare comment: string;
  declare replies: CreationOptional<number>;
  declare likes: CreationOptional<number>;

  declare parentId: string;
  declare parentType: "ParentComment" | "ParentPost";

  declare uid: string;

  declare Parent?: NonAttribute<Comment | Post>;
  declare ParentComment?: NonAttribute<Comment>;
  declare ParentPost?: NonAttribute<Post>;
  declare Replies?: NonAttribute<Comment[]>;
  declare Author?: NonAttribute<User>;
  declare CommentCommentLikes?: NonAttribute<CommentLikes[]>;
  declare CommentLikers?: NonAttribute<User[]>;
  declare isLiked?: boolean;

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
    Comment.hasMany(CommentLikes, {
      as: "CommentCommentLikes",
      foreignKey: "commentId",
    });
    Comment.belongsToMany(User, {
      as: "CommentLikers",
      foreignKey: "commentId",
      otherKey: "uid",
      through: CommentLikes,
    });
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
        isLiked: {
          get() {
            return this.getDataValue("isLiked");
          },
          set(value: boolean) {
            this.setDataValue("isLiked", value);
          },
          type: DataTypes.VIRTUAL,
        },
        likes: {
          defaultValue: 0,
          type: DataTypes.INTEGER,
        },
        parentId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        parentType: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        replies: {
          defaultValue: 0,
          type: DataTypes.INTEGER,
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
    Comment.afterDestroy(async (comment, options) => {
      await Comment.destroy({
        transaction: options.transaction,
        where: {
          parentId: comment.commentId,
          parentType: "ParentComment",
        },
      });
    });
  }
}

export default Comment;
