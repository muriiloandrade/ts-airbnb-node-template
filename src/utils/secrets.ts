import dotenv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply environment variables.');
  dotEnvExpand(dotenv.config({ path: '.env' }));
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

export const DB_NAME = prod ? process.env.DB_PROD_NAME : process.env.DB_LOCAL_NAME;

if (!DB_NAME) {
  if (prod) {
    logger.error('No mongo database name. Set DB_PROD_NAME environment variable.');
  } else {
    logger.error('No mongo database name. Set DB_LOCAL_NAME environment variable.');
  }
  process.exit(1);
}

export const MONGODB_URI = prod ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;

if (!MONGODB_URI) {
  if (prod) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
  } else {
    logger.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.');
  }
  process.exit(1);
}
