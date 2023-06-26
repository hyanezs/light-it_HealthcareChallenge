import dayjs from 'dayjs';
import { type NextFunction, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../dataAccess/repositories';
import { UnauthorizedError } from '../exceptions';
import { Genders } from '../types';
import { type UserModel } from '../types/models';
import { type RequestWithUser } from './../types/requests';

const jwtKey = process.env.JWT_SECRET;

type Cookies = {
  token: string;
};

const auth =
  () => async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') {
      req.user = {
        id: 1,
        firstName: 'Carly',
        lastName: 'Doe',
        email: '  ',
        gender: Genders.FEMALE,
        birthdate: dayjs('1990-01-01'),
      } as unknown as UserModel;
      next();
      return;
    }

    const { token } = req.cookies as Cookies;

    if (!token) {
      next(new UnauthorizedError());
      return;
    }

    try {
      if (!jwtKey) {
        next(new Error('JWT_SECRET is not set'));
        return;
      }

      const decodedUser = jwt.verify(token, jwtKey) as unknown as UserModel;
      if (!decodedUser) {
        next(new UnauthorizedError());
        return;
      }

      const exists = await getUserById(decodedUser?.id);
      if (!exists) {
        next(new UnauthorizedError());
        return;
      }

      req.user = decodedUser;
      next();
    } catch (ex: any) {
      if (ex.name === 'TokenExpiredError') {
        next(
          new UnauthorizedError(
            'Session expired. Please log back in to continue browsing.',
          ),
        );
        return;
      }

      next(new UnauthorizedError('Something went wrong while authenticating.'));
    }
  };

export default auth;
