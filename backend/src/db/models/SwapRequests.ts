/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import Class from "./Class.js";
import User from "./User.js";

interface SwapRequests extends BelongsToMixin<Class, number, "FromClass"> {}
interface SwapRequests extends BelongsToMixin<Class, number, "ToClass"> {}
interface SwapRequests extends BelongsToMixin<User, string, "User"> {}

class SwapRequests extends Model<
  InferAttributes<SwapRequests>,
  InferCreationAttributes<SwapRequests>
> {
  declare id: CreationOptional<string>;
  declare status: "cancelled" | "fulfilled" | "pending";
  declare priority: number;

  declare fromClassId: number;
  declare toClassId: number;
  declare uid: string;

  declare FromClass?: NonAttribute<Class>;
  declare ToClass?: NonAttribute<Class>;
  declare User?: NonAttribute<User>;

  static associate() {
    SwapRequests.belongsTo(Class, {
      as: "FromClass",
      foreignKey: "fromClassId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    SwapRequests.belongsTo(Class, {
      as: "ToClass",
      foreignKey: "toClassId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    SwapRequests.belongsTo(User, {
      as: "User",
      foreignKey: "uid",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    SwapRequests.init(
      {
        fromClassId: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        priority: {
          defaultValue: 1,
          type: DataTypes.INTEGER,
        },
        status: {
          defaultValue: "pending",
          type: DataTypes.ENUM("pending", "fulfilled", "cancelled"),
        },
        toClassId: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        uid: {
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

export default SwapRequests;
