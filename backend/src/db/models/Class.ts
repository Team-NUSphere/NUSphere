import { DataTypes, Model, Sequelize } from "sequelize";
// import { BelongsTo, BelongsToAssociation, Column, DataType, Table } from "sequelize-typescript";

import { DB, TimetableModelStatic } from "./types.js";
// import Module from "./Module.js";

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

// @Table({
//   modelName: "Class",
//   timestamps: false,
// })
// class Class extends Model {
//   @Column({
//     type: DataTypes.INTEGER
//   })
//   classNo!: number;

//   @Column({
//     type: DataType.STRING
//   })
//   day!: string;

//   @Column({
//     type: DataType.TIME
//   })
//   endTime!: string;

//   @Column({
//     defaultValue: DataType.UUIDV4,
//     primaryKey: true,
//     type: DataType.UUIDV4
//   })
//   id!: string;

//   @Column({
//     type: DataType.STRING
//   })
//   lessonType!: string;

//   @Column({
//     type: DataType.TIME
//   })
//   startTime!: string;

//   @Column({
//     type: DataType.STRING
//   })
//   venue!: string;

//   @Column({
//     type: DataType.ARRAY(DataType.INTEGER)
//   })
//   weeks!: number[];

//   @BelongsTo(() => Module)
// }
