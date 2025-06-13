import { DataTypes, Model, Sequelize } from "sequelize";

import { TimetableModelStatic } from "./types.js";

export interface ModuleTimetableAttributes {
  uid: string;
}

export interface ModuleTimetableInstance
  extends Model<ModuleTimetableAttributes>,
    ModuleTimetableAttributes {}

export default (
  sequelize: Sequelize,
): TimetableModelStatic<ModuleTimetableInstance> => {
  const ModuleTimetable = sequelize.define("ModuleTimetable", {
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      unique: true,
    },
  }) as TimetableModelStatic<ModuleTimetableInstance>;

  return ModuleTimetable;
};
