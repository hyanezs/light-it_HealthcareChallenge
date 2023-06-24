import { Router, type NextFunction, type Response } from 'express';
import { auth } from '../../middlewares';
import { StatusCodes } from '../../types';
import { type RequestWithUser } from '../../types/requests';

const meController = Router();

// GET /me
meController.get(
  '/',
  auth(),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id, email, firstName, lastName } = req.user!;

      res.status(StatusCodes.OK).send({
        id,
        email,
        firstName,
        lastName,
      });
    } catch (e: any) {
      next(e);
    }
  },
);

export default meController;
