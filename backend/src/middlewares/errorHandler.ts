import { type NextFunction, type Request, type Response } from 'express';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../exceptions';
import { StatusCodes, type Error } from '../types';
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
    code = StatusCodes.BAD_REQUEST;
  } else if (e instanceof ConflictError) {
    code = StatusCodes.CONFLICT;
  } else if (e instanceof ForbiddenError) {
    code = StatusCodes.FORBIDDEN;
  } else if (e instanceof UnauthorizedError) {
    code = StatusCodes.UNAUTHORIZED;
  } else if (e instanceof NotFoundError) {
    code = StatusCodes.NOT_FOUND;
  } else {
    code = StatusCodes.SERVER_ERROR;
  }

  logger.warn(e.message);
  return res.status(code).send({ error: e.message });
};

export default errorHandler;
