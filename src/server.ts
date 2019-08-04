import logger from './utils/logger';
import app from './app';

app.listen(
  app.get('port'), () => {
    logger.info(`App running on port ${app.get('port')} in mode ${app.get('env')}!`);
  },
);
