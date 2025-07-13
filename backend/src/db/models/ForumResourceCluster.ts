/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable perfectionist/sort-classes */
import { BelongsToMixin, HasManyMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import ForumGroup from "./ForumGroup.js";
import ForumResource from "./ForumResource.js";

interface ForumResourceCluster
  extends HasManyMixin<ForumResource, string, "Resource", "Resources"> {}
interface ForumResourceCluster
  extends BelongsToMixin<ForumGroup, string, "Group"> {}

class ForumResourceCluster extends Model<
  InferAttributes<ForumResourceCluster>,
  InferCreationAttributes<ForumResourceCluster>
> {
  declare clusterId: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string>;

  declare groupId: string;

  declare Resources?: NonAttribute<ForumResource[]>;
  declare Group?: NonAttribute<ForumGroup>;

  static associate() {
    ForumResourceCluster.hasMany(ForumResource, {
      as: "Resources",
      foreignKey: "clusterId",
    });
    ForumResourceCluster.belongsTo(ForumGroup, {
      as: "Group",
      foreignKey: "groupId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    ForumResourceCluster.init(
      {
        clusterId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
        description: {
          allowNull: true,
          type: DataTypes.TEXT,
        },
        groupId: {
          allowNull: false,
          type: DataTypes.UUID,
        },
        name: {
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

export default ForumResourceCluster;
