module.exports = {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database:  process.env.POSTGRES_DB,
    entities: ["src/entities/**/*.entity{.ts,.js}"],
    seeds: ['src/seeds/**/*{.ts,.js}']
  }