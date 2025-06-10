import { DataTypes, Model, Sequelize } from "sequelize";

import { DB, TimetableModelStatic } from "./types.js";

export interface UserAttributes {
  uid: string;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export default (sequelize: Sequelize): TimetableModelStatic<UserInstance> => {
  const User = sequelize.define("User", {
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
  }) as TimetableModelStatic<UserInstance>;

  User.associate = (db: DB) => {
    User.hasOne(db.UserTimetable, { foreignKey: "uid" });
    User.belongsToMany(db.Module, {
      foreignKey: "uid",
      through: "Enrollments",
    });
  };
  return User;
};
