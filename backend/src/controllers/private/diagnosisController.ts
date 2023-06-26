import dayjs from 'dayjs';
import { Router, type NextFunction, type Response } from 'express';
import getDiagnosis from '../../logic/diagnosisLogic';
import { auth } from '../../middlewares';
import { Genders, StatusCodes } from '../../types';
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

      if (!params.gender) params.gender = Genders[user!.gender].toLowerCase();
      if (!params.birthyear)
        params.birthyear = dayjs(user!.birthdate).year().toString();

      const diagnosis = await getDiagnosis(params);

      res.status(StatusCodes.OK).send({
        data: diagnosis,
      });
    } catch (e: any) {
      next(e);
    }
  },
);

export default diagnosisController;
