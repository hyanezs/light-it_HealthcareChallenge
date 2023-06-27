import dayjs from 'dayjs';
import { Router, type NextFunction, type Response } from 'express';
import {
  editDiagnosis,
  getDiagnosesRequest,
  getPossibleDiagnoses,
  getUsersDiagnosesHistory,
} from '../../logic/diagnosesLogic';
import { auth } from '../../middlewares';
import { Genders, StatusCodes } from '../../types';
import {
  type GetDiagnosesReqBody,
  type RequestWithUser,
  type UpdateDiagnosisReqBody,
} from '../../types/requests';

const diagnosesController = Router();

// POST /diagnoses
diagnosesController.post(
  '/',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const body = req.body as unknown as GetDiagnosesReqBody;
      const { user } = req;

      if (!body.gender) body.gender = Genders[user!.gender].toLowerCase();
      if (!body.birthyear)
        body.birthyear = dayjs(user!.birthdate).year().toString();

      const diagnoses = await getPossibleDiagnoses(body, user!);

      res.status(StatusCodes.OK).send({
        data: diagnoses,
      });
    } catch (e: any) {
      next(e);
    }
  },
);

// GET /diagnoses
diagnosesController.get(
  '/',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      const history = await getUsersDiagnosesHistory(user);

      res.status(StatusCodes.OK).send({
        data: history,
      });
    } catch (e: any) {
      next(e);
    }
  },
);

// GET /diagnoses/1
diagnosesController.get(
  '/:id(\\d+)',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { user } = req;

      const diagnosis = await getDiagnosesRequest(id, user!);

      res.status(StatusCodes.OK).send({
        data: diagnosis,
      });
    } catch (e: any) {
      next(e);
    }
  },
);

// PUT /diagnoses/1
diagnosesController.put(
  '/:id(\\d+)',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { user } = req;
      const data = req.body as UpdateDiagnosisReqBody;

      await editDiagnosis(id, user!, data);

      res.status(StatusCodes.OK).send({
        success: 'Diagnosis updated successfully',
      });
    } catch (e: any) {
      next(e);
    }
  },
);

export default diagnosesController;
