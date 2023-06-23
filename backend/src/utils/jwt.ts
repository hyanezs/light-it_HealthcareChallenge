import jwt from 'jsonwebtoken';

const generateJwtToken = (obj: Record<string, unknown>): string => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set.');

  return jwt.sign(obj, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
};

export default generateJwtToken;
