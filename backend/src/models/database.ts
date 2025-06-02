import { Sequelize } from "sequelize";

const dbUser: string = process.env.DB_USER ?? "default";
const dbPassword: string = process.env.DB_PASSWORD ?? "default";
const dbHost: string = process.env.DB_HOST ?? "127.0.0.1";
const dbPort: string = parseInt(process.env.DB_PORT ?? "1234").toString();
const dbName: string = process.env.DB_NAME ?? "database";
const databaseUrl: string =
  process.env.DATABASE_URL ??
  `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

console.log(databaseUrl);

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      require: true,
    },
  },
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("Database connected");
} catch (error) {
  console.error("Unable to establish database connection", error);
}
