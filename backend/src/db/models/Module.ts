/* eslint-disable perfectionist/sort-modules */
/* eslint-disable perfectionist/sort-classes */
import {
  BelongsToManyMixin,
  HasManyMixin,
} from "#db/types/associationtypes.js";
import {
  Department,
  Faculty,
  ModuleCode,
  ModuleTitle,
} from "#db/types/nusmodstypes.js";
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

interface ModuleCreationAttributes extends InferCreationAttributes<Module> {
  Classes?: InferCreationAttributes<Class>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface Module extends HasManyMixin<Class, number, "Class", "Classes"> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
interface Module extends BelongsToManyMixin<User, string, "User", "Users"> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Module extends Model<InferAttributes<Module>, ModuleCreationAttributes> {
  declare department: Department;
  declare description: CreationOptional<string>;
  declare faculty: Faculty;
  declare gradingBasis: CreationOptional<string>;
  declare moduleCredit: number;
  declare moduleId: ModuleCode;
  declare title: ModuleTitle;

  declare Classes?: NonAttribute<Class[]>;

  declare Users?: NonAttribute<User[]>;

  static associate() {
    Module.hasMany(Class, { as: "Classes", foreignKey: "moduleId" });
    Module.belongsToMany(User, {
      as: "Users",
      foreignKey: "moduleId",
      otherKey: "uid",
      through: "Enrollments",
    });
  }

  static initModel(sequelize: Sequelize) {
    Module.init(
      {
        department: {
          type: DataTypes.STRING,
        },
        description: {
          allowNull: true,
          type: DataTypes.TEXT,
        },
        faculty: {
          type: DataTypes.STRING,
        },
        gradingBasis: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        moduleCredit: {
          type: DataTypes.FLOAT,
        },
        moduleId: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.STRING,
          unique: true,
        },
        title: {
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

export default Module;

// export interface ModuleAttributes {
//   department: Department;
//   description: CreationOptional<string>;
//   faculty: Faculty;
//   gradingBasis: CreationOptional<string>;
//   moduleCredit: number;
//   moduleId: ModuleCode;
//   title: ModuleTitle;
// }
// export interface ModuleInstance
//   extends Model<ModuleAttributes>,
//     ModuleAttributes {}

// export default (sequelize: Sequelize): DbModelStatic<ModuleInstance> => {
//   const Module = sequelize.define("Module", {
//     department: {
//       type: DataTypes.STRING,
//     },
//     description: {
//       type: DataTypes.TEXT,
//     },
//     faculty: {
//       type: DataTypes.STRING,
//     },
//     gradingBasis: {
//       type: DataTypes.STRING,
//     },
//     moduleCredit: {
//       type: DataTypes.INTEGER,
//     },
//     moduleId: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.STRING,
//       unique: true,
//     },
//     title: {
//       allowNull: false,
//       type: DataTypes.STRING,
//     },
//   }) as DbModelStatic<ModuleInstance>;

//   Module.associate = (db: DB) => {
//     Module.hasMany(db.Class, { foreignKey: "moduleId" });
//     Module.belongsToMany(db.User, {
//       foreignKey: "moduleId",
//       through: "Enrollments",
//     });
//   };
//   return Module;
// };
