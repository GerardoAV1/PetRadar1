import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  // App
  PORT: env.get('PORT').default('3000').asPortNumber(),

  // Database (PostgreSQL + PostGIS)
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),
  DB_PORT: env.get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: env.get('DB_USER').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),

  // Redis (cache para endpoints GET)
  REDIS_HOST: env.get('REDIS_HOST').default('localhost').asString(),
  REDIS_PORT: env.get('REDIS_PORT').default('6379').asPortNumber(),
  REDIS_TTL_MS: env.get('REDIS_TTL_MS').default('60000').asIntPositive(),

  // Azure Application Insights
  APPLICATIONINSIGHTS_CONNECTION_STRING: env
    .get('APPLICATIONINSIGHTS_CONNECTION_STRING')
    .default('')
    .asString(),

  // Mapbox (opcional)
  MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').default('').asString(),

  // Mailer (opcional)
  MAILER_EMAIL: env.get('MAILER_EMAIL').default('').asString(),
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').default('').asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').default('gmail').asString(),
};
