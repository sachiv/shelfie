export const options = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  dialect: "postgres",
  logging: process.env.VERCEL_ENV === "development" ? console.log : false,
  migrationStorageTableName: "migrations",
  ...(process.env.POSTGRES_PORT
    ? { port: Number(process.env.POSTGRES_PORT) }
    : {}),
};

if (process.env.VERCEL_ENV === "production") {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
      require: true,
    },
  };
}

const config = { development: options, production: options, test: options };

export default config;
