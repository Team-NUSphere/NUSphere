/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { HasManyMixin, HasOneMixin } from "#db/types/associationtypes.js";
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
import UserEvent from "./UserEvents.js";
import UserTimetable from "./UserTimetable.js";

interface User extends HasOneMixin<UserTimetable, string, "Timetable"> {}
interface User extends HasManyMixin<Post, string, "Post", "Posts"> {}
interface User extends HasManyMixin<Comment, string, "Comment", "Comments"> {}
interface User
  extends HasManyMixin<ForumGroup, string, "OwnedGroup", "OwnedGroups"> {}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uid: string;

  declare Timetable?: NonAttribute<UserTimetable>;
  declare OwnedGroups?: NonAttribute<ForumGroup[]>;
  declare Comments?: NonAttribute<Comment[]>;
  declare Posts?: NonAttribute<Post[]>;

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
