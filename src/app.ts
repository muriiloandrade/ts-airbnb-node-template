import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import logger from './utils/logger';
import { MONGODB_URI } from './utils/secrets';

class App {
  public app: express.Application

  private mongoUrl = MONGODB_URI;

  public constructor() {
    this.app = express();
    this.database();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.set('port', process.env.PORT || 3333);
    logger.info('Middlewares OK!');
  }

  private database(): void {
    mongoose.connect(`${this.mongoUrl}`, {
      poolSize: 50,
      wtimeout: 2500,
      useNewUrlParser: true,
    }).then(() => {
      logger.info('MongoDB up and running!');
    }).catch((err: mongoose.Error) => {
      logger.error(`MongoDB connection error. Error: ${err.message}`);
      process.exit(1);
    });
  }

  private routes(): void {
    this.app.get('/', (req, res) => res.send('Hello World!'));
  }
}

export default new App().app;
