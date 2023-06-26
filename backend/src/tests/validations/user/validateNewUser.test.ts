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

  it('should throw a Bad Request error when payload is invalid', async () => {
    const newUser: RegisterUser = {
      firstName: '',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '02/12/2000',
      gender: 'male',
    };

    const err = new BadRequestError('firstName is required.');

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
