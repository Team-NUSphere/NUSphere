/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import {
  BelongsToManyMixin,
  HasManyMixin,
  HasOneMixin,
} from "#db/types/associationtypes.js";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import Comment from "./Comment.js";
import Enrollment from "./Enrollment.js";
import ForumGroup from "./ForumGroup.js";
import Module from "./Module.js";
import Post from "./Post.js";
import PostLikes from "./PostLikes.js";
import UserEvent from "./UserEvents.js";
import UserTimetable from "./UserTimetable.js";

interface User extends HasOneMixin<UserTimetable, string, "Timetable"> {}
interface User extends HasManyMixin<Post, string, "Post", "Posts"> {}
interface User extends HasManyMixin<Comment, string, "Comment", "Comments"> {}
interface User
  extends HasManyMixin<ForumGroup, string, "OwnedGroup", "OwnedGroups"> {}
interface User
  extends HasManyMixin<PostLikes, string, "UserPostLike", "UserPostLikes"> {}
interface User
  extends BelongsToManyMixin<Post, string, "LikedPost", "LikedPosts"> {}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uid: string;

  declare Timetable?: NonAttribute<UserTimetable>;
  declare OwnedGroups?: NonAttribute<ForumGroup[]>;
  declare Comments?: NonAttribute<Comment[]>;
  declare Posts?: NonAttribute<Post[]>;
  declare UserPostLikes?: NonAttribute<PostLikes[]>;
  declare LikedPosts?: NonAttribute<Post[]>;

  async getUserTimetable() {
    let userTimetable = await this.getTimetable({
      include: [
        {
          as: "Events",
          model: UserEvent,
        },
        {
          as: "Modules",
          model: Module,
        },
        {
          as: "Enrollments",
          model: Enrollment,
        },
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!userTimetable) {
      userTimetable = await this.createTimetable();
      userTimetable.Events = [];
      userTimetable.Modules = [];
      userTimetable.Enrollments = [];
    }
    this.Timetable = userTimetable;
    return userTimetable;
  }

  async likeNewPost(postId: string) {
    const post = await Post.findByPk(postId);
    if (!post) return null;

    const [, added] = await PostLikes.addNewLike(this.uid, post.postId);
    if (!added) return null;
    this.LikedPosts = await this.getLikedPosts();
    this.UserPostLikes = await this.getUserPostLikes();
    return post;
  }

  async unlikePost(postId: string) {
    const post = await Post.findByPk(postId);
    if (!post) return null;

    await PostLikes.unlike(this.uid, postId);
    this.LikedPosts = await this.getLikedPosts();
    this.UserPostLikes = await this.getUserPostLikes();
    return post;
  }

  static associate() {
    User.hasOne(UserTimetable, { as: "Timetable", foreignKey: "uid" });
    User.hasMany(Post, { as: "Posts", foreignKey: "uid" });
    User.hasMany(Comment, { as: "Comments", foreignKey: "uid" });
    User.hasMany(ForumGroup, {
      as: "OwnedGroups",
      foreignKey: "ownerId",
      onDelete: "CASCADE",
      scope: { ownerType: "User" },
    });
    User.hasMany(PostLikes, {
      as: "UserPostLikes",
      foreignKey: "uid",
    });
    User.belongsToMany(Post, {
      as: "LikedPosts",
      foreignKey: "uid",
      otherKey: "postId",
      through: PostLikes,
    });
  }

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        uid: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.STRING,
          unique: true,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default User;

// export interface UserAttributes {
//   uid: string;
// }
// export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

// export default (sequelize: Sequelize): DbModelStatic<UserInstance> => {
//   const User = sequelize.define("User", {
//     uid: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.STRING,
//       unique: true,
//     },
//   }) as DbModelStatic<UserInstance>;

//   User.associate = (db: DB) => {
//     User.hasOne(db.UserTimetable, { foreignKey: "uid" });
//     User.belongsToMany(db.Module, {
//       as: "Modules",
//       foreignKey: "uid",
//       otherKey: "moduleId",
//       through: "Enrollments"
//     });
//   };
//   return User;
// };
