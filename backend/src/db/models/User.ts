/* eslint-disable perfectionist/sort-classes */
import { BelongsToManyMixin, HasOneMixin } from "#db/types/associationtypes.js";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import Module from "./Module.js";
import UserTimetable from "./UserTimetable.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface User extends HasOneMixin<UserTimetable, number, "Timetable"> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface User
  extends BelongsToManyMixin<Module, string, "Module", "Modules"> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uid: string;

  declare Timetable?: NonAttribute<UserTimetable>;
  declare Modules?: NonAttribute<Module[]>;

  static associate() {
    User.hasOne(UserTimetable, { as: "Timetable", foreignKey: "uid" });
    User.belongsToMany(Module, {
      as: "Modules",
      foreignKey: "uid",
      otherKey: "moduleId",
      through: "Enrollments",
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
