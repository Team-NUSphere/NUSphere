/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin, HasOneMixin } from "#db/types/associationtypes.js";
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
import User from "./User.js";

interface SwapRequests extends BelongsToMixin<User, string, "User"> {}
interface SwapRequests extends HasOneMixin<MatchedRequest, string, "Match"> {}

class SwapRequests extends Model<
  InferAttributes<SwapRequests>,
  InferCreationAttributes<SwapRequests>
> {
  declare id: CreationOptional<string>;
  declare status: "cancelled" | "fulfilled" | "pending";

  declare moduleCode: string;
  declare lessonType: string;
  declare fromClassNo: string;
  declare toClassNos: string[];

  declare uid: string;
  declare User?: NonAttribute<User>;
  declare Match?: NonAttribute<MatchedRequest>;

  static associate() {
    SwapRequests.belongsTo(User, {
      as: "User",
      foreignKey: "uid",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    SwapRequests.hasOne(MatchedRequest, {
      as: "Match",
      foreignKey: "requestId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    SwapRequests.init(
      {
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
        lessonType: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        moduleCode: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        status: {
          defaultValue: "pending",
          type: DataTypes.ENUM("pending", "fulfilled", "cancelled"),
        },
        toClassNos: {
          allowNull: false,
          type: DataTypes.ARRAY(DataTypes.STRING),
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
