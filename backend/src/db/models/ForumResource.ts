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

import ForumResourceCluster from "./ForumResourceCluster.js";

interface ForumResource
  extends BelongsToMixin<ForumResourceCluster, string, "Cluster"> {}

class ForumResource extends Model<
  InferAttributes<ForumResource>,
  InferCreationAttributes<ForumResource>
> {
  declare resourceId: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string>;
  declare link: CreationOptional<string>;

  declare clusterId: string;

  declare Cluster?: NonAttribute<ForumResourceCluster>;

  static associate() {
    ForumResource.belongsTo(ForumResourceCluster, {
      as: "Cluster",
      foreignKey: "clusterId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    ForumResource.init(
      {
        clusterId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        description: {
          allowNull: true,
          type: DataTypes.TEXT,
        },
        link: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        resourceId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default ForumResource;
