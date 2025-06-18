/* eslint-disable perfectionist/sort-classes */
import { HasOneMixin } from "#db/types/associationtypes.js";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import Enrollment from "./Enrollment.js";
import Module from "./Module.js";
import UserEvent from "./UserEvents.js";
import UserTimetable from "./UserTimetable.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface User extends HasOneMixin<UserTimetable, number, "Timetable"> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uid: string;

  declare Timetable?: NonAttribute<UserTimetable>;

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
