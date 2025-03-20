import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [path.join(__dirname, "../entities/**/*.ts")],
    migrations: [path.join(__dirname, "../migrations/**/*.ts")],
    migrationsTableName: "migration",
    synchronize: false,
});

export default AppDataSource;
