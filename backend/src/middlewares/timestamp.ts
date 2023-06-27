import { type NextFunction, type Request, type Response } from 'express';

const appendTimestamp = (req: Request, res: Response, next: NextFunction) => {
  if (!(process.env.NODE_ENV === 'test'))
    req.body.requestTimestamp = Date.now();
  next();
};

export default appendTimestamp;
