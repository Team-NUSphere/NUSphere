// import { databaseUrl } from "#configs/sequelizeOptions.js";
import { Options, Sequelize } from "sequelize";

import * as dbConfig from "./config/config.cjs";
import Class from "./models/Class.js";
import Comment from "./models/Comment.js";
import CommentLikes from "./models/CommentLikes.js";
import Enrollment from "./models/Enrollment.js";
import ForumGroup from "./models/ForumGroup.js";
import Module from "./models/Module.js";
import Post from "./models/Post.js";
import PostLikes from "./models/PostLikes.js";
import User from "./models/User.js";
import UserEvent from "./models/UserEvents.js";
import UserTimetable from "./models/UserTimetable.js";
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

await sequelize.sync();

Class.initModel(sequelize);
Module.initModel(sequelize);
User.initModel(sequelize);
UserEvent.initModel(sequelize);
UserTimetable.initModel(sequelize);
Enrollment.initModel(sequelize);
Post.initModel(sequelize);
ForumGroup.initModel(sequelize);
Comment.initModel(sequelize);
PostLikes.initModel(sequelize);
CommentLikes.initModel(sequelize);

const db: DB = {
  Class: Class,
  Comment: Comment,
  CommentLikes: CommentLikes,
  Enrollment: Enrollment,
  ForumGroup: ForumGroup,
  Module: Module,
  Post: Post,
  PostLikes: PostLikes,
  User: User,
  UserEvent: UserEvent,
  UserTimetable: UserTimetable,
};

await sequelize.sync();

Object.keys(db).forEach((modelName) => {
  db[modelName].associate();
});

await sequelize.sync();

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
