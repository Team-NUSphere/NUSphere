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

import Class from "./Class.js";
import User from "./User.js";
import UserEvent from "./UserEvents.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface UserTimetable
  extends HasManyMixin<UserEvent, string, "Event", "Events"> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface UserTimetable extends BelongsToMixin<User, string, "User"> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface UserTimetable
  extends BelongsToManyMixin<Class, number, "Class", "Classes"> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class UserTimetable extends Model<
  InferAttributes<UserTimetable>,
  InferCreationAttributes<UserTimetable>
> {
  declare timetableId?: CreationOptional<number>;

  declare uid: CreationOptional<string>;

  declare Events?: NonAttribute<UserEvent[]>;
  declare User?: NonAttribute<User>;
  declare Classes?: NonAttribute<Class[]>;

  static associate() {
    UserTimetable.hasMany(UserEvent, {
      as: "Events",
      foreignKey: "timetableId",
    });
    UserTimetable.belongsTo(User, { as: "User", foreignKey: "uid" });
    UserTimetable.belongsToMany(Class, {
      as: "Classes",
      foreignKey: "timetableId",
      otherKey: "classId",
      through: "SelectedClasses",
    });
  }

  static initModel(sequelize: Sequelize) {
    UserTimetable.init(
      {
        timetableId: {
          autoIncrement: true,
          primaryKey: true,
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
  }
}

export default UserTimetable;

// export interface UserTimetableAttributes {
//   id: number;
// }

// export interface UserTimetableInstance
//   extends Model<UserTimetableAttributes>,
//     UserTimetableAttributes {}

// export default (sequelize: Sequelize): DbModelStatic<UserTimetableInstance> => {
//   const UserTimetable = sequelize.define("UserTimetable", {
//     timetableId: {
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER,
//     },
//   }) as DbModelStatic<UserTimetableInstance>;

//   UserTimetable.associate = (db: DB) => {
//     UserTimetable.hasMany(db.UserEvent, { foreignKey: "timetableId" });
//     UserTimetable.belongsTo(db.User, { foreignKey: "uid" });
//     UserTimetable.belongsToMany(db.Class, {
//       foreignKey: "timetableId",
//       through: "SelectedClasses",
//     });
//   };
//   return UserTimetable;
// };
