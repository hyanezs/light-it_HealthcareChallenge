import { getUserByCondition } from '../../../dataAccess/repositories';
import { BadRequestError, ConflictError } from '../../../exceptions';
import { RegisterUser } from '../../../types/requests';
import { validateNewUser } from '../../../validations';

jest.mock('../../../dataAccess/repositories');

describe('validateNewUser', () => {
  const mockedGetUserByCondition = getUserByCondition as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not throw an error on valid payload', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    mockedGetUserByCondition.mockResolvedValue(null);

    await expect(validateNewUser(newUser)).resolves.not.toThrow();
    expect(getUserByCondition).toHaveBeenCalledWith({ email: newUser.email });
  });

  it('should throw a Bad Request error when lastName is missing', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: '',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('lastName is required.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when firstname is missing', async () => {
    const newUser: RegisterUser = {
      firstName: '',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('firstName is required.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when gender is missing', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: '',
    };

    const err = new BadRequestError('gender is required.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when birthdate is missing', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '',
      gender: 'male',
    };

    const err = new BadRequestError('birthdate is required.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when birthdate is invalid', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '40/40/20',
      gender: 'male',
    };

    const err = new BadRequestError('birthdate: 40/40/20 is invalid.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when gender is invalid', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'agender',
    };

    const err = new BadRequestError(
      'gender: agender is invalid. Needs to be one of: MALE, FEMALE.',
    );

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when email is invalid', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'notanemail',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('email: notanemail is invalid.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when email is missing', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('email is required.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when password is missing', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: '',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('password is required.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when password is too short', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'short',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('password must be at least 8 characters.');

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Bad Request error when password is invalid', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'passwordinvalid',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError(
      'password must contain at least one uppercase letter, one lowercase letter, and one digit',
    );

    await expect(validateNewUser(newUser)).rejects.toThrow(err);
    expect(getUserByCondition).not.toHaveBeenCalled();
  });

  it('should throw a Conflict error when user already exists', async () => {
    const newUser: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    mockedGetUserByCondition.mockResolvedValue(newUser);

    await expect(validateNewUser(newUser)).rejects.toThrow(
      new ConflictError('User with email test@example.com already exists.'),
    );
    expect(getUserByCondition).toHaveBeenCalledWith({ email: newUser.email });
  });
});
