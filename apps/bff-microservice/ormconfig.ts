import { config } from 'dotenv';

config({ path: `apps/bff-microservice/.env` });

export default [
  {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/src/**/**.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsRun: false,
    cli: {
      entitiesDir: __dirname + '/src/',
      migrationsDir: __dirname + '/migrations',
    },
    synchronize: true,
  },
];
