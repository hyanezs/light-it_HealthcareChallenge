import { Router, type NextFunction, type Response } from 'express';
import getDiagnosis from '../../logic/diagnosisLogic';
import { auth } from '../../middlewares';
import { StatusCodes } from '../../types';
import {
  type GetDiagnosisParams,
  type RequestWithUser,
} from '../../types/requests';

const diagnosisController = Router();

// GET /diagnosis
diagnosisController.get(
  '/',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const params = req.query as unknown as GetDiagnosisParams;
      const { user } = req;

      if (!params.gender) params.gender = user!.gender;
      if (!params.birthyear) params.birthyear = user!.birthdate.year();

      const diagnosis = await getDiagnosis(params);

      res.status(StatusCodes.OK).send();
    } catch (e: any) {
      next(e);
    }
  },
);

export default diagnosisController;
