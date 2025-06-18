/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
  Sequelize,
} from "sequelize";

import Module from "./Module.js";
import UserTimetable from "./UserTimetable.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface Enrollment
  extends BelongsToMixin<UserTimetable, string, "UserTimetable"> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface Enrollment extends BelongsToMixin<Module, string, "Module"> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Enrollment extends Model<
  InferAttributes<Enrollment>,
  InferCreationAttributes<Enrollment>
> {
  declare id: CreationOptional<string>;
  declare classes: string[];

  declare timetableId: CreationOptional<string>;
  declare moduleId: CreationOptional<string>;

  declare UserTimetable?: NonAttribute<UserTimetable>;
  declare Module?: NonAttribute<Module>;

  static async addNewEnrollment(
    timetableId: string,
    moduleCode: string,
    classes: string[],
  ) {
    return await Enrollment.findOrCreate({
      defaults: {
        classes: classes,
        moduleId: moduleCode,
        timetableId: timetableId,
      },
      where: {
        [Op.and]: [{ moduleId: moduleCode }, { timetableId: timetableId }],
      },
    });
  }

  async editClass(lessonType: string, classNo: string) {
    const idx =
      this.Module?.lessonTypes.findIndex((lt) => lt === lessonType) ?? -1;
    if (idx === -1) throw new Error("Lesson type not found for the module");
    this.classes[idx] = classNo;
    this.changed("classes", true);
    await this.save();
    return (
      (await this.Module?.getClasses({
        where: {
          [Op.and]: [{ classNo: classNo }, { lessonType: lessonType }],
        },
      })) ?? []
    );
  }

  static async unregister(timetableId: string, moduleCode: string) {
    const enrollment = await Enrollment.findOne({
      where: {
        [Op.and]: [{ moduleId: moduleCode }, { timetableId: timetableId }],
      },
    });
    if (!enrollment) return;
    await enrollment.destroy();
  }

  static associate() {
    Enrollment.belongsTo(UserTimetable, {
      as: "UserTimetable",
      foreignKey: "timetableId",
    });
    Enrollment.belongsTo(Module, { as: "Module", foreignKey: "moduleId" });
  }

  static initModel(sequelize: Sequelize) {
    Enrollment.init(
      {
        classes: {
          allowNull: false,
          type: DataTypes.ARRAY(DataTypes.STRING),
        },
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        moduleId: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        timetableId: {
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

export default Enrollment;
