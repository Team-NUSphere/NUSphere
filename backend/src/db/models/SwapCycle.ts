/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { HasManyMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import MatchedRequest from "./MatchedRequest.js";

interface SwapCycle
  extends HasManyMixin<MatchedRequest, string, "Request", "Requests"> {}

class SwapCycle extends Model<
  InferAttributes<SwapCycle>,
  InferCreationAttributes<SwapCycle>
> {
  declare id: CreationOptional<string>;
  declare status: "confirmed" | "pending";

  declare Requests?: NonAttribute<MatchedRequest[]>;

  static associate() {
    SwapCycle.hasMany(MatchedRequest, {
      as: "Requests",
      foreignKey: "cycleId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    SwapCycle.init(
      {
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        status: {
          defaultValue: "pending",
          type: DataTypes.ENUM("pending", "confirmed"),
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default SwapCycle;
