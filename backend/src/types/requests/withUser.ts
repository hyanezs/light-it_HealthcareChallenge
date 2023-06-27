import { type Request } from 'express';
import { type UserModel } from '../models';

export type RequestWithUser = {
  user?: UserModel;
} & Request;
