import dayjs from 'dayjs';
import emailValidator from 'email-validator';
import { getUserByCondition } from '../dataAccess/repositories';
import { BadRequestError, ConflictError } from '../exceptions';
import { Genders } from '../types/constants';
import { type RegisterUser } from '../types/requests';

const validatePassword = (password: string): void => {
  if (!password) {
    throw new BadRequestError('password is required.');
  }

  if (password.length < 8) {
    throw new BadRequestError('password must be at least 8 characters.');
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!regex.test(password)) {
    throw new BadRequestError(
      'password must contain at least one uppercase letter, one lowercase letter, and one digit',
    );
  }
};

const validateUserAttributes = (user: RegisterUser): void => {
  const { firstName, lastName, birthdate, gender, email, password } = user;

  if (!firstName) {
    throw new BadRequestError('firstName is required.');
  }

  if (!lastName) {
    throw new BadRequestError('lastName is required.');
  }

  if (!gender) {
    throw new BadRequestError('gender is required.');
  }

  if (!birthdate) {
    throw new BadRequestError('birthdate is required.');
  }

  if (!dayjs(birthdate).isValid()) {
    throw new BadRequestError(`birthdate: ${birthdate.toString()} is invalid.`);
  }

  if (
    !Object.values(Genders).includes(
      gender.toString().toUpperCase() as any as Genders,
    )
  ) {
    throw new BadRequestError(
      `gender: ${gender} is invalid. Needs to be one of: ${Object.values(
        Genders,
      )
        .filter((g) => typeof g === 'string')
        .join(', ')}.`,
    );
  }

  if (!email) {
    throw new BadRequestError('email is required.');
  }

  if (!emailValidator.validate(email)) {
    throw new BadRequestError(`email: ${email} is invalid.`);
  }

  validatePassword(password);
};

const validateUserDoesNotExist = async (email: string) => {
  const existsUserWithEmail = await getUserByCondition({ email });
  if (existsUserWithEmail) {
    throw new ConflictError(`User with email ${email} already exists.`);
  }
};

const validateNewUser = async (newUser: RegisterUser): Promise<void> => {
  validateUserAttributes(newUser);
  await validateUserDoesNotExist(newUser.email);
};

export { validateNewUser };
