// import { databaseUrl } from "#configs/sequelizeOptions.js";
import { Options, Sequelize } from "sequelize";

import * as dbConfig from "../config/config.cjs";
import initClassModel from "./Class.js";
import initModuleModel from "./Module.js";
import initModuleTimetableModel from "./ModuleTimetable.js";
import { DB } from "./types.js";
import initUserModel from "./User.js";
import initUserEventModel from "./UserEvents.js";
import initUserTimetableModel from "./UserTimetable.js";

type NodeEnv = "development" | "production" | "test";
const env: NodeEnv = (process.env.NODE_ENV ?? "development") as NodeEnv;
type DbConfigs = Record<string, Options>;
const config = (dbConfig.default as DbConfigs)[env];
const sequelize = new Sequelize(
  config.database ?? "default",
  config.username ?? "user",
  config.password ?? "password",
  config,
);

try {
  await sequelize.authenticate();
  console.log("Database connected");
} catch (error) {
  console.error("Unable to establish database connection", error);
}

export const UserModel = initUserModel(sequelize);
export const UserEventModel = initUserEventModel(sequelize);
export const UserTimetableModel = initUserTimetableModel(sequelize);
export const ModuleModel = initModuleModel(sequelize);
export const ModuleTimetableModel = initModuleTimetableModel(sequelize);
export const ClassModel = initClassModel(sequelize);

const db: DB = {
  Class: ClassModel,
  Module: ModuleModel,
  ModuleTimetable: ModuleTimetableModel,
  User: UserModel,
  UserEvent: UserEventModel,
  UserTimetable: UserTimetableModel,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    console.log("associating");
    db[modelName].associate(db);
  }
});

export default db;

// export const sequelize = new Sequelize(databaseUrl, {
//   dialect: "postgres",
//   // dialectOptions: {
//   //   ssl: {
//   //     rejectUnauthorized: false,
//   //     require: false,
//   //   },
//   // },
//   logging: false,
// });

// const modelFile: string[] = fs.readdirSync(__dirname).filter((file) => {
//   return !file.startsWith(".") && file !== basename && file.endsWith(".js");
// });

// for (const file of modelFile) {
//   interface modelModuleType {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     default: (sequelize: Sequelize) => TimetableModelStatic<any>;
//   }
//   const modelModule: modelModuleType = (await import(
//     path.join(__dirname, file)
//   )) as modelModuleType;
//   const model = modelModule.default(sequelize);
//   db[model.name] = model;
//   console.log("importing");
// }
