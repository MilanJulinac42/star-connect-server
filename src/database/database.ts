import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";
import { envSchema } from "../config/env.schema";
import { MIGRATIONS_TABLE } from "../../migrations/config";

dotenv.config();

const env = envSchema.parse(process.env);

const migrationsPath = path.join(
  __dirname,
  "..",
  "..",
  "migrations",
  "history",
  "*.js"
);

const AppDataSource = new DataSource({
  type: "postgres",
  host: env["DATABASE_HOST"],
  port: env["DATABASE_PORT"],
  username: env["DATABASE_USER"],
  password: env["DATABASE_PASSWORD"],
  database: env["DATABASE_NAME"],
  entities: [],
  migrationsTableName: MIGRATIONS_TABLE,
  migrations: [migrationsPath],
  migrationsRun: true,
  migrationsTransactionMode: "each",
  synchronize: false,
  logging: ["error", "warn"],
  poolSize: env["DATABASE_POOLSIZE"],
});

export default AppDataSource;
