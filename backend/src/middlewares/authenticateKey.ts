import { type NextFunction, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { getStore } from '../dataAccess/repositories';
import { UnauthorizedError } from '../exceptions';
import type { StoreModel } from '../types/models';
import { type RequestWithStore } from '../types/requests/withStore';

const authenticateKey =
  () => async (req: RequestWithStore, _res: Response, next: NextFunction) => {
    try {
      if (process.env.environment === 'test') {
        req.store = {
          id: req.headers.store,
        } as unknown as StoreModel;
      }

      if (process.env.DISABLE_AUTH) {
        next();
        return;
      }

      const apiKey = req.header('api-key');

      if (!apiKey) {
        next(new UnauthorizedError('Missing api key.'));
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        next(new Error('JWT_SECRET is not set'));
        return;
      }

      const decodedStore = jwt.verify(
        apiKey,
        jwtSecret,
      ) as unknown as StoreModel;

      if (!decodedStore) {
        next(new UnauthorizedError('Invalid api key.'));
        return;
      }

      const exists = await getStore(decodedStore.id);
      if (!exists) {
        next(new UnauthorizedError('Invalid api key.'));
        return;
      }

      req.store = decodedStore;
      next();
      return;
    } catch (e: any) {
      console.log(e);
      next(
        new UnauthorizedError(
          'Something went wrong while authenticating api key.',
        ),
      );
    }
  };

export default authenticateKey;
