import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";
import { envSchema } from "../src/config/env.schema";

dotenv.config();

const env = envSchema.parse(process.env);

export const MIGRATIONS_TABLE = "migrations";

const AppDataSource = new DataSource({
  type: "postgres",
  host: env["DATABASE_HOST"],
  port: env["DATABASE_PORT"],
  username: env["DATABASE_USER"],
  password: env["DATABASE_PASSWORD"],
  database: env["DATABASE_NAME"],
  synchronize: false,
  entities: [path.join(__dirname, "..", "src", "**", "*.entity.js")],
  migrations: [path.join(__dirname, "history", "*.js")],
});

export default AppDataSource;
