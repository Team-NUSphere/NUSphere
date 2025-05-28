import { DataTypes, Model } from "sequelize";

import { sequelize } from "./database.js";

class Timetable extends Model {}

Timetable.init(
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
  },
);

export default Timetable;
