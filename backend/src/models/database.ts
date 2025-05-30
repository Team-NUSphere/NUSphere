import { Sequelize } from "sequelize";

const dbUser: string = process.env.DB_USER ?? "default";
const dbPassword: string = process.env.DB_PASSWORD ?? "default";
const dbHost: string = process.env.DB_HOST ?? "127.0.0.1";
const dbPort: string = parseInt(process.env.DB_PORT ?? "1234").toString();
const dbName: string = process.env.DB_NAME ?? "database";

export const sequelize = new Sequelize(
  `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
);

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log("Database connected");
} catch (error) {
  console.error("Unable to establish database connection", error);
}
