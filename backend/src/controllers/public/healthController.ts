import { Router, type NextFunction, type Response } from 'express';
import { isCacheUp as getCacheHealth } from '../../dataAccess/cache/cache-access';
import { isDbUp as getDbHealth } from '../../dataAccess/postgres';
import { startDate } from '../../server';
import { StatusCodes } from '../../types';

const healthController = Router();

// GET /health
healthController.get('/', async (_, res: Response, next: NextFunction) => {
  const isDbUp = await getDbHealth();
  const isCacheUp = await getCacheHealth();
  return res.status(StatusCodes.OK).send({
    status: {
      db: isDbUp,
      cache: isCacheUp,
      app: 'Recieving requests.',
      upTime: process.uptime(),
      startDate,
    },
  });
});

export default healthController;
