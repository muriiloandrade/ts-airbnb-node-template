import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import logger from './utils/logger';

class App {
  public app: express.Application

  public constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    // Cors is optional, comment if you don't need it
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.set('port', process.env.PORT || 3333);
    logger.info('Middlewares OK!');
  }

  private routes(): void {
    this.app.use('/user', userRoutes);
    logger.info('Routes OK!');
  }
}

export default new App().app;
