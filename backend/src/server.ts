import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import winston from 'winston';
import privateRoutes from './controllers/private/privateRoutes';
import publicRoutes from './controllers/public/publicRoutes';
import { appendTimestamp, errorHandler, httpLogger } from './middlewares';
import logger, { consoleLoggerFormat } from './utils/logger';

const port = process.env.SERVER_PORT ?? 5001;
const allowedOrigin = process.env.FRONTEND_HOST ?? 'http://localhost:3000';

const app = express();
const startDate = new Date();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(appendTimestamp);
app.use(httpLogger);
app.use(publicRoutes);
app.use(privateRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Inventsaas API');
});

async function initServer(): Promise<void> {
  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}

logger.add(
  new winston.transports.Console({
    format: consoleLoggerFormat,
    level: 'debug',
  }),
);

export { app, initServer, startDate };
