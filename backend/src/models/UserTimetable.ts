import { DataTypes, Model, Sequelize } from "sequelize";

import { DB, TimetableModelStatic } from "./types.js";

export interface UserTimetableAttributes {
  id: number;
}

export interface UserTimetableInstance
  extends Model<UserTimetableAttributes>,
    UserTimetableAttributes {}

export default (
  sequelize: Sequelize,
): TimetableModelStatic<UserTimetableInstance> => {
  const UserTimetable = sequelize.define("UserTimetable", {
    timetableId: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  }) as TimetableModelStatic<UserTimetableInstance>;

  UserTimetable.associate = (db: DB) => {
    UserTimetable.hasMany(db.UserEvent, { foreignKey: "timetableId" });
    UserTimetable.belongsTo(db.User, { foreignKey: "uid" });
    UserTimetable.belongsToMany(db.Class, {
      foreignKey: "timetableId",
      through: "SelectedClasses",
    });
  };
  return UserTimetable;
};
