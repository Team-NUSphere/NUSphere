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

import SwapCycle from "./SwapCycle.js";
import SwapRequests from "./SwapRequests.js";

interface MatchedRequest extends BelongsToMixin<SwapCycle, string, "Cycle"> {}
interface MatchedRequest
  extends BelongsToMixin<SwapRequests, string, "Request"> {}

class MatchedRequest extends Model<
  InferAttributes<MatchedRequest>,
  InferCreationAttributes<MatchedRequest>
> {
  declare id: CreationOptional<string>;

  declare requestId: string;
  declare cycleId: string;

  declare position: number;
  declare fromClassNo: string;
  declare toClassNo: string;

  declare Cycle?: NonAttribute<SwapCycle>;
  declare Request?: NonAttribute<SwapRequests>;

  static associate() {
    MatchedRequest.belongsTo(SwapCycle, {
      as: "Cycle",
      foreignKey: "cycleId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    MatchedRequest.belongsTo(SwapRequests, {
      as: "Request",
      foreignKey: "requestId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    MatchedRequest.init(
      {
        cycleId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        fromClassNo: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        position: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        requestId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        toClassNo: {
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

export default MatchedRequest;
