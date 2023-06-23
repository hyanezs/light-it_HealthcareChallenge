import { getUserByCondition } from '../../../dataAccess/repositories';
import { BadRequestError } from '../../../exceptions';
import { validateHashedString } from '../../../utils';
import { validateLogin } from '../../../validations';

jest.mock('../../../dataAccess/repositories');
jest.mock('../../../utils');

const mockedGetUserByCondition = getUserByCondition as jest.Mock;
const mockedValidateHashedString = validateHashedString as jest.Mock;

describe('validateLogin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user object for valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userInDb = {
      email,
      firstName: 'John',
      lastName: 'Doe',
      id: 1,
      password: 'someHashedPassword',
    };

    mockedGetUserByCondition.mockResolvedValue(userInDb);
    mockedValidateHashedString.mockResolvedValue(true);

    const result = await validateLogin(email, password);

    expect(getUserByCondition).toHaveBeenCalledWith({ email });
    expect(validateHashedString).toHaveBeenCalledWith(
      password,
      userInDb.password,
    );
    expect(result).toEqual(userInDb);
  });

  it('should throw generic BadRequestError for incorrect email', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userInDb = null;

    mockedGetUserByCondition.mockResolvedValue(userInDb);

    await expect(validateLogin(email, password)).rejects.toThrow(
      new BadRequestError('Incorrect Email or Password. Please try again.'),
    );
    expect(getUserByCondition).toHaveBeenCalledWith({ email });
    expect(validateHashedString).not.toHaveBeenCalled();
  });

  it('should throw generic BadRequestError for incorrect password', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userInDb = {
      email,
      firstName: 'John',
      lastName: 'Doe',
      id: 1,
      password: 'someHashedPassword',
    };

    mockedGetUserByCondition.mockResolvedValue(userInDb);
    mockedValidateHashedString.mockResolvedValue(false);

    await expect(validateLogin(email, password)).rejects.toThrow(
      new BadRequestError('Incorrect Email or Password. Please try again.'),
    );
    expect(getUserByCondition).toHaveBeenCalledWith({ email });
    expect(validateHashedString).toHaveBeenCalledWith(
      password,
      userInDb.password,
    );
  });
});
