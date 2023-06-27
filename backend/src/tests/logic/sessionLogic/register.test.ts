import dayjs from 'dayjs';
import { persistUser } from '../../../dataAccess/repositories';
import { BadRequestError } from '../../../exceptions';
import { register } from '../../../logic/sessionLogic';
import { Genders } from '../../../types/constants';
import { RegisterUser } from '../../../types/requests';
import { generateJwtToken, transformUserForm } from '../../../utils';
import { validateNewUser } from '../../../validations';

jest.mock('../../../dataAccess/repositories');
jest.mock('../../../utils');
jest.mock('../../../validations');

describe('register', () => {
  const mockedPersistUser = persistUser as jest.Mock;
  const mockedGenerateJwtToken = generateJwtToken as jest.Mock;
  const mockedTransformUserForm = transformUserForm as jest.Mock;
  const mockedValidateNewUser = validateNewUser as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and return the generated token', async () => {
    const userFormData: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '1990-01-01',
      gender: 'male',
    };

    const transformedUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'encrypted-password',
      birthdate: dayjs('1990-01-01'),
      gender: Genders.MALE,
    };

    const newUser = {
      id: 1,
      ...transformedUserData,
    };

    const token = 'avalidjwttoken';

    mockedGenerateJwtToken.mockReturnValue(token);
    mockedValidateNewUser.mockResolvedValue(null);
    mockedTransformUserForm.mockResolvedValue(transformedUserData);
    mockedPersistUser.mockResolvedValue(newUser);

    const result = await register(userFormData);

    expect(result).toBe(token);
    expect(validateNewUser).toHaveBeenCalledWith(userFormData);
    expect(transformUserForm).toHaveBeenCalledWith(userFormData);
    expect(persistUser).toHaveBeenCalledWith(transformedUserData);
    expect(generateJwtToken).toHaveBeenCalledWith({
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      id: newUser.id,
    });
  });

  it('should throw an error when validation fails', async () => {
    const userFormData: RegisterUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthdate: '1990-01-01',
      gender: 'male',
    };

    mockedValidateNewUser.mockRejectedValue(
      new BadRequestError('firstName is required.'),
    );

    await expect(register(userFormData)).rejects.toThrow(
      new BadRequestError('firstName is required.'),
    );
    expect(persistUser).not.toHaveBeenCalled();
    expect(generateJwtToken).not.toHaveBeenCalled();
    expect(transformUserForm).not.toHaveBeenCalled();
    expect(validateNewUser).toHaveBeenCalledWith(userFormData);
  });

  it('should throw an error when persistence fails', async () => {
    const userFormData: RegisterUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      birthdate: '1990-01-01',
      gender: 'male',
    };

    const transformedUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'encrypted-password',
      birthdate: dayjs('1990-01-01'),
      gender: Genders.MALE,
    };

    mockedValidateNewUser.mockResolvedValue(null);
    mockedTransformUserForm.mockResolvedValue(transformedUserData);
    mockedPersistUser.mockRejectedValue(new Error());

    await expect(register(userFormData)).rejects.toThrow(new Error());
    expect(persistUser).toHaveBeenCalledWith(transformedUserData);
    expect(generateJwtToken).not.toHaveBeenCalled();
    expect(transformUserForm).toHaveBeenCalledWith(userFormData);
    expect(validateNewUser).toHaveBeenCalledWith(userFormData);
  });
});
