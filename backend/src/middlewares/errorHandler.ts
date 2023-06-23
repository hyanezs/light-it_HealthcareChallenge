import { type NextFunction, type Request, type Response } from 'express';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../exceptions';
import { ErrorStatusCodes, type Error } from '../types';
import { logger } from '../utils';

// Logs error & respond to clients
const errorHandler = (
  e: Error,
  _req: Request,
  res: Response,

  _next: NextFunction,
) => {
  let code = 500;

  if (e instanceof BadRequestError) {
    code = ErrorStatusCodes.BAD_REQUEST;
  } else if (e instanceof ConflictError) {
    code = ErrorStatusCodes.CONFLICT;
  } else if (e instanceof ForbiddenError) {
    code = ErrorStatusCodes.FORBIDDEN;
  } else if (e instanceof UnauthorizedError) {
    code = ErrorStatusCodes.UNAUTHORIZED;
  } else if (e instanceof NotFoundError) {
    code = ErrorStatusCodes.NOT_FOUND;
  } else {
    code = ErrorStatusCodes.SERVER_ERROR;
  }

  logger.warn(e.message);
  return res.status(code).send({ error: e.message });
};

export default errorHandler;
