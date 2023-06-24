import { Router, type NextFunction, type Response } from 'express';
import { auth } from '../../middlewares';
import { StatusCodes } from '../../types';
import { type RequestWithUser } from '../../types/requests';

const diagnosisController = Router();

// GET /diagnosis
diagnosisController.get(
  '/',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send();
    } catch (e: any) {
      next(e);
    }
  },
);

export default diagnosisController;
