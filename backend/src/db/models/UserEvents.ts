import { DataTypes, Model, Sequelize } from "sequelize";

import { DB, TimetableModelStatic } from "./types.js";

export interface UserEventAttributes {
  description?: string;
  endTime?: string;
  eventId?: string;
  isRecurring: boolean;
  name: string;
  startTime?: string;
}

export interface UserEventInstance
  extends Model<UserEventAttributes>,
    UserEventAttributes {}

export default (
  sequelize: Sequelize,
): TimetableModelStatic<UserEventInstance> => {
  const UserEvent = sequelize.define("UserEvent", {
    description: {
      type: DataTypes.TEXT,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    eventId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      unique: true,
    },
    isRecurring: {
      allowNull: false,
      defaultValue: "false",
      type: DataTypes.BOOLEAN,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.DATE,
    },
  }) as TimetableModelStatic<UserEventInstance>;

  UserEvent.associate = (db: DB) => {
    UserEvent.belongsTo(db.UserTimetable, { foreignKey: "timetableId" });
  };
  return UserEvent;
};
