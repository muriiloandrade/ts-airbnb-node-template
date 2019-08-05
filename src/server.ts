import { Error, connect } from 'mongoose';
import logger from './utils/logger';
import { MONGODB_URI } from './utils/secrets';

import app from './app';

// Connection with the database
// Try to reconnect for 10min
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
  app.listen(
    app.get('port'), () => {
      logger.info(`App running on port ${app.get('port')} in mode ${app.get('env')}!`);
    },
  );
}).catch((err: Error) => {
  logger.error(`MongoDB connection error: ${err.message}`);
  process.exit(1);
});
