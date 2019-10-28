import https from 'https';
import fs from 'fs';
import { Error, connect } from 'mongoose';
import logger from './utils/logger';
import {
  MONGODB_URI, CERT, CERT_KEY, CERT_PASS,
} from './utils/secrets';

import app from './app';

const httpsOptions = {
  cert: fs.readFileSync(`${__dirname}/${CERT}`),
  key: fs.readFileSync(`${__dirname}/${CERT_KEY}`),
  passphrase: `${CERT_PASS}`,
};

// Connection with the database
// Tries to reconnect for 10min
connect(`${MONGODB_URI}`, {
  poolSize: 50,
  wtimeout: 2500,
  autoReconnect: true,
  reconnectInterval: 5000,
  numberOfRetries: 120,
  useFindAndModify: true,
  useCreateIndex: true,
  useNewUrlParser: true,
}).then(() => {
  logger.info('MongoDB up and running!');
  https.createServer(httpsOptions, app)
    .listen(
      app.get('port'), () => {
        logger.info(`App running on port ${app.get('port')} in mode ${app.get('env')}!`);
      },
    );
  app.listen(3333, () => {
    logger.info(`App running on port 3333 in mode ${app.get('env')}!`);
  });
}).catch((err: Error) => {
  logger.error(`MongoDB connection error: ${err.message}`);
  process.exit(1);
});
