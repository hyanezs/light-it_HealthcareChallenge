import { getUserByCondition } from '../../../dataAccess/repositories';
import { BadRequestError } from '../../../exceptions';
import { login } from '../../../logic/sessionLogic';
import { generateJwtToken, validateHashedString } from '../../../utils';

jest.mock('../../../utils');
jest.mock('../../../dataAccess/repositories');

describe('login', () => {
  const mockedGenerateJwtToken = generateJwtToken as jest.Mock;
  const mockedGetUserByCondition = getUserByCondition as jest.Mock;
  const mockedValidateHashedString = validateHashedString as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a JWT token for valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userInDb = {
      email,
      firstName: 'John',
      lastName: 'Doe',
      id: 1,
      password: 'somepass',
    };

    mockedGenerateJwtToken.mockResolvedValue('avalidjwttoken');
    mockedGetUserByCondition.mockResolvedValue(userInDb);
    mockedValidateHashedString.mockResolvedValue(true);

    const result = await login(email, password);

    expect(getUserByCondition).toBeCalledWith({ email });
    expect(validateHashedString).toBeCalledWith(password, userInDb.password);
    expect(generateJwtToken).toHaveBeenCalledWith({
      ...userInDb,
      password: undefined,
    });
    expect(result).toBe('avalidjwttoken');
  });

  it('should throw BadRequestError for missing email', async () => {
    const email = '';
    const password = 'Password123';

    await expect(login(email, password)).rejects.toThrow(
      new BadRequestError('credentials (email & password) are required.'),
    );
    expect(generateJwtToken).not.toHaveBeenCalled();
    expect(getUserByCondition).not.toHaveBeenCalled();
    expect(validateHashedString).not.toHaveBeenCalled();
  });

  it('should throw BadRequestError for missing password', async () => {
    const email = 'email@email.com';
    const password = '';

    await expect(login(email, password)).rejects.toThrow(
      new BadRequestError('credentials (email & password) are required.'),
    );
    expect(generateJwtToken).not.toHaveBeenCalled();
    expect(getUserByCondition).not.toHaveBeenCalled();
    expect(validateHashedString).not.toHaveBeenCalled();
  });
});
