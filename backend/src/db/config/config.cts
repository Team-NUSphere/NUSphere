// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
require("dotenv").config();

module.exports = {
  development: {
    database: process.env.DB_NAME,
    dialect: "postgres",
    host: process.env.DB_HOST,
    logging: false,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    username: process.env.DB_USER,
  },
  production: {
    database: process.env.DB_NAME,
    dialect: "postgres",
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? "1234"),
    username: process.env.DB_USER,
  },
  test: {
    database: process.env.DB_NAME,
    dialect: "postgres",
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? "1234"),
    username: process.env.DB_USER,
  },
};
