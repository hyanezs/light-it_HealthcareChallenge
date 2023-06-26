import dayjs from 'dayjs';
import { Router, type NextFunction, type Response } from 'express';
import getDiagnoses from '../../logic/diagnosesLogic';
import { auth } from '../../middlewares';
import { Genders, StatusCodes } from '../../types';
import {
  type GetDiagnosesParams,
  type RequestWithUser,
} from '../../types/requests';

const diagnosesController = Router();

// GET /diagnoses
diagnosesController.get(
  '/',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const params = req.query as unknown as GetDiagnosesParams;
      const { user } = req;

      if (!params.gender) params.gender = Genders[user!.gender].toLowerCase();
      if (!params.birthyear)
        params.birthyear = dayjs(user!.birthdate).year().toString();

      const diagnoses = await getDiagnoses(params);

      res.status(StatusCodes.OK).send({
        data: diagnoses,
      });
    } catch (e: any) {
      next(e);
    }
  },
);

export default diagnosesController;
