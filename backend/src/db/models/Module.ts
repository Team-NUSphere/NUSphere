import { DataTypes, Model, Sequelize } from "sequelize";

import { DB, TimetableModelStatic } from "./types.js";

export interface ModuleAttributes {
  uid: string;
}

export interface ModuleInstance
  extends Model<ModuleAttributes>,
    ModuleAttributes {}

export default (sequelize: Sequelize): TimetableModelStatic<ModuleInstance> => {
  const Module = sequelize.define("Module", {
    moduleId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
  }) as TimetableModelStatic<ModuleInstance>;

  Module.associate = (db: DB) => {
    Module.hasMany(db.Class, { foreignKey: "moduleId" });
    Module.belongsToMany(db.User, {
      foreignKey: "moduleId",
      through: "Enrollments",
    });
  };
  return Module;
};
