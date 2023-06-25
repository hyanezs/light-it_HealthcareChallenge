import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../utils';

export default async (_req: Request, _res: Response, next: NextFunction) => {
  logger.debug(
    'Randomly delaying response in DEV to simulate api request time...',
  );

  setTimeout(() => {
    next();
  }, Math.floor(Math.random() * 1000 + 100));
};
