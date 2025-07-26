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
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
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
