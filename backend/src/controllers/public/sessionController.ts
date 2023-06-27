import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { login, register } from '../../logic/sessionLogic';
import { StatusCodes } from '../../types';
import type { Login, RegisterUser } from '../../types/requests';

const sessionController = Router();

// POST /auth/register
sessionController.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body as RegisterUser;

      const token = await register(userData);
      res
        .status(StatusCodes.OK)
        .cookie('token', token, {
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
          domain: 'localhost',
        })
        .send({
          success: `Successful registration! Welcome ${userData.firstName}!`,
        });
    } catch (e: any) {
      next(e);
    }
  },
);

// POST /auth/login
sessionController.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as Login;
      const token: string = await login(email, password);
      res
        .status(StatusCodes.OK)
        .cookie('token', token, {
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
          domain: 'localhost',
        })
        .send({
          success: `Successful login! Welcome back.`,
        });
    } catch (e: any) {
      next(e);
    }
  },
);

// POST /auth/logout
sessionController.post(
  '/logout',
  async (_, res: Response, next: NextFunction) => {
    try {
      res
        .status(StatusCodes.OK)
        .clearCookie('token', {
          domain: 'localhost',
        })
        .send({ success: `Successful logout.` });
    } catch (e: any) {
      next(e);
    }
  },
);

export default sessionController;
