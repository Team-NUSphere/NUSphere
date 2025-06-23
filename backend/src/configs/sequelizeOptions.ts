const dbUser: string = process.env.DB_USER ?? "default";
const dbPassword: string = process.env.DB_PASSWORD ?? "default";
const dbHost: string = process.env.DB_HOST ?? "127.0.0.1";
const dbPort: string = parseInt(process.env.DB_PORT ?? "1234").toString();
const dbName: string = process.env.DB_NAME ?? "database";
export const databaseUrl: string =
  process.env.DATABASE_URL ??
  `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
