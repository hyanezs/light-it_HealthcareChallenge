import { Router, type NextFunction, type Response } from 'express';
import { getSymptoms } from '../../logic/symptomsLogic';
import { auth } from '../../middlewares';
import { StatusCodes } from '../../types';
import { type RequestWithUser } from '../../types/requests';

const symptomsController = Router();

// GET /symptoms
symptomsController.get(
  '/',
  auth(),
  async (_req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const symptoms = await getSymptoms();
      res.status(StatusCodes.OK).send(symptoms);
    } catch (e: any) {
      next(e);
    }
  },
);

export default symptomsController;
