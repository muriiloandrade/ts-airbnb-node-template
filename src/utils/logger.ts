import {
  Logger, LoggerOptions, transports, createLogger, format,
} from 'winston';

const options: LoggerOptions = {
  format: format.combine(
    format.timestamp({ format: 'DD-MM-YY HH:mm:ss' }),
    format.colorize(),
    format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`),
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    // new transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
};

const logger: Logger = createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
