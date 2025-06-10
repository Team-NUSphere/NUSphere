import { DataTypes, Model, Sequelize } from "sequelize";

import { DB, TimetableModelStatic } from "./types.js";

export interface ClassAttributes {
  classNo: string;
  day: string;
  endTime: string;
  id?: number;
  lessonType: string;
  startTime: string;
  venue: string;
  weeks: number[];
}

export interface ClassInstance
  extends ClassAttributes,
    Model<ClassAttributes> {}

export default (sequelize: Sequelize): TimetableModelStatic<ClassInstance> => {
  const Class = sequelize.define<ClassInstance>("User", {
    classNo: {
      type: DataTypes.STRING,
    },
    day: {
      type: DataTypes.STRING,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    lessonType: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    venue: {
      type: DataTypes.STRING,
    },
    weeks: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
  }) as TimetableModelStatic<ClassInstance>;

  Class.associate = (db: DB) => {
    Class.belongsTo(db.Module, { foreignKey: "moduleId" });
    Class.belongsToMany(db.UserTimetable, {
      foreignKey: "classId",
      through: "SelectedClasses",
    });
  };
  return Class;
};
