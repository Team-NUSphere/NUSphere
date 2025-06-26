/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
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

import Post from "./Post.js";

interface ForumGroup extends HasManyMixin<Post, string, "Post", "Posts"> {}

class ForumGroup extends Model<
  InferAttributes<ForumGroup>,
  InferCreationAttributes<ForumGroup>
> {
  declare groupId: CreationOptional<string>;
  declare groupName: string;

  declare Posts?: NonAttribute<Post[]>;

  static associate() {
    ForumGroup.hasMany(Post, { as: "Posts", foreignKey: "groupid" });
  }

  static initModel(sequelize: Sequelize) {
    ForumGroup.init(
      {
        groupId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          type: DataTypes.UUID,
        },
        groupName: {
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

export default ForumGroup;
