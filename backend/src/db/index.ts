// import { databaseUrl } from "#configs/sequelizeOptions.js";
import { Options, Sequelize } from "sequelize";

import * as dbConfig from "./config/config.cjs";
import { SwapGraphManager } from "./graphStorage.js";
import Class from "./models/Class.js";
import Comment from "./models/Comment.js";
import CommentLikes from "./models/CommentLikes.js";
import Enrollment from "./models/Enrollment.js";
import ForumGroup from "./models/ForumGroup.js";
import ForumResource from "./models/ForumResource.js";
import ForumResourceCluster from "./models/ForumResourceCluster.js";
import MatchedRequest from "./models/MatchedRequest.js";
import Module from "./models/Module.js";
import Post from "./models/Post.js";
import PostLikes from "./models/PostLikes.js";
import PostTag from "./models/PostTag.js";
import SwapCycle from "./models/SwapCycle.js";
import SwapRequests from "./models/SwapRequests.js";
import Tags from "./models/Tags.js";
import User from "./models/User.js";
import UserEvent from "./models/UserEvents.js";
import UserTimetable from "./models/UserTimetable.js";

import "dotenv/config";

import { DB } from "./types/dbtypes.js";

type NodeEnv = "development" | "production" | "test";
const env: NodeEnv = (process.env.NODE_ENV ?? "development") as NodeEnv;
type DbConfigs = Record<string, Options>;
const config = (dbConfig.default as DbConfigs)[env];
export const sequelize = new Sequelize(
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

// What in the world was I thinking when i wrote this abomination

// Class.initModel(sequelize);
// Module.initModel(sequelize);
// User.initModel(sequelize);
// UserEvent.initModel(sequelize);
// UserTimetable.initModel(sequelize);
// Enrollment.initModel(sequelize);
// Post.initModel(sequelize);
// ForumGroup.initModel(sequelize);
// Comment.initModel(sequelize);
// PostLikes.initModel(sequelize);
// CommentLikes.initModel(sequelize);
// Tags.initModel(sequelize);
// PostTag.initModel(sequelize);
// ForumResource.initModel(sequelize);
// ForumResourceCluster.initModel(sequelize);

const db: DB = {
  Class,
  Comment,
  CommentLikes,
  Enrollment,
  ForumGroup,
  ForumResource,
  ForumResourceCluster,
  MatchedRequest,
  Module,
  Post,
  PostLikes,
  PostTag,
  SwapCycle,
  SwapRequests,
  Tags,
  User,
  UserEvent,
  UserTimetable,
};

Object.values(db).forEach((model) => {
  model.initModel(sequelize);
});

await sequelize.sync();

Object.values(db).forEach((model) => {
  model.associate();
});

await sequelize.sync();

const swapManager = new SwapGraphManager();

await swapManager.loadGraphFromDb();

export { swapManager };
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
