import { DataTypes, Model, Sequelize } from "sequelize";

import { DbModelStatic } from "../types/dbtypes.js";

export interface ModuleTimetableAttributes {
  uid: string;
}

export interface ModuleTimetableInstance
  extends Model<ModuleTimetableAttributes>,
    ModuleTimetableAttributes {}

export default (
  sequelize: Sequelize,
): DbModelStatic<ModuleTimetableInstance> => {
  const ModuleTimetable = sequelize.define("ModuleTimetable", {
    uid: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
  }) as DbModelStatic<ModuleTimetableInstance>;

  return ModuleTimetable;
};
