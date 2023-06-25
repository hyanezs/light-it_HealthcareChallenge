import { type NextFunction, type Request, type Response } from 'express';
import { logger } from '../utils';

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (req.url === '/me') {
    next();
    return;
  }

  logger.debug(
    'Randomly delaying response in DEV to simulate api request time...',
  );

  setTimeout(() => {
    next();
  }, Math.floor(Math.random() * 1000 + 100));
};
