/* eslint-disable perfectionist/sort-classes */
import {
  BelongsToManyMixin,
  BelongsToMixin,
} from "#db/types/associationtypes.js";
import {
  ClassNo,
  DayText,
  EndTime,
  LessonType,
  StartTime,
  Venue,
} from "#db/types/nusmodstypes.js";
import {
  CreationOptional,
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
interface Class extends BelongsToMixin<Module, string, "Module"> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface Class
  extends BelongsToManyMixin<
    UserTimetable,
    number,
    "UserTimetable",
    "UserTimetables"
  > {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Class extends Model<
  InferAttributes<Class>,
  InferCreationAttributes<Class>
> {
  declare classNo: ClassNo;
  declare day: DayText;
  declare endTime: EndTime;
  declare classId: CreationOptional<number>;
  declare lessonType: LessonType;
  declare startTime: StartTime;
  declare venue: Venue;
  declare weeks?: CreationOptional<number[]>;
  declare startDate?: CreationOptional<string>;
  declare endDate?: CreationOptional<string>;
  declare weekInterval?: CreationOptional<number>;

  declare moduleId: CreationOptional<string>;

  declare Module?: NonAttribute<Module>;

  static associate() {
    Class.belongsTo(Module, { as: "Module", foreignKey: "moduleId" });
  }

  static initModel(sequelize: Sequelize) {
    Class.init(
      {
        classId: {
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        classNo: {
          type: DataTypes.STRING,
        },
        day: {
          type: DataTypes.STRING,
        },
        endDate: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        endTime: {
          type: DataTypes.TIME,
        },
        lessonType: {
          type: DataTypes.STRING,
        },
        moduleId: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        startDate: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        startTime: {
          type: DataTypes.TIME,
        },
        venue: {
          type: DataTypes.STRING,
        },
        weekInterval: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        weeks: {
          allowNull: true,
          type: DataTypes.ARRAY(DataTypes.INTEGER),
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default Class;

// export interface ClassAttributes {
//   classNo: ClassNo;
//   day: DayText;
//   endTime: EndTime;
//   id?: number;
//   lessonType: LessonType;
//   startTime: StartTime;
//   venue: Venue;
//   weeks: Weeks;
// }
// export interface ClassInstance
//   extends ClassAttributes,
//     Model<ClassAttributes> {}

// export default (sequelize: Sequelize): DbModelStatic<ClassInstance> => {
//   const Class = sequelize.define<ClassInstance>("Class", {
//     classNo: {
//       type: DataTypes.STRING,
//     },
//     day: {
//       type: DataTypes.STRING,
//     },
//     endTime: {
//       type: DataTypes.TIME,
//     },
//     id: {
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER,
//     },
//     lessonType: {
//       type: DataTypes.STRING,
//     },
//     startTime: {
//       type: DataTypes.TIME,
//     },
//     venue: {
//       type: DataTypes.STRING,
//     },
//     weeks: {
//       type: DataTypes.ARRAY(DataTypes.INTEGER),
//     },
//   }) as DbModelStatic<ClassInstance>;

//   Class.associate = (db: DB) => {
//     Class.belongsTo(db.Module, { foreignKey: "moduleId" });
//     Class.belongsToMany(db.UserTimetable, {
//       foreignKey: "classId",
//       through: "SelectedClasses",
//     });
//   };
//   return Class;
// };

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
