import { persistUser } from '../dataAccess/repositories';
import { type PersistUser } from '../dataAccess/repositories/userRepository';
import { BadRequestError } from '../exceptions';
import { type RegisterUser } from '../types/requests';
import { generateJwtToken, transformUserForm } from '../utils';
import { validateLogin, validateNewUser } from '../validations';

const login = async (email: string, password: string): Promise<string> => {
  if (!email || !password) {
    throw new BadRequestError('credentials (email & password) are required.');
  }

  const userInDb = await validateLogin(email, password);

  return generateJwtToken({
    email: userInDb.email,
    firstName: userInDb.firstName,
    lastName: userInDb.lastName,
    id: userInDb.id,
  });
};

const register = async (userFormData: RegisterUser): Promise<string> => {
  await validateNewUser(userFormData);

  const userData = await transformUserForm(userFormData);

  const newUser = await persistUser(userData as PersistUser);

  const token = generateJwtToken({
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    id: newUser.id,
  });

  return token;
};

export { login, register };
