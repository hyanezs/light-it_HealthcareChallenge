import dayjs from 'dayjs';
import { Genders } from '../../types/constants';
import { hashString } from '../../utils/bcrypt';
import { transformUserForm } from '../../utils';

jest.mock('../../utils/bcrypt');

describe('transformUserForm', () => {
  const mockedHashString = hashString as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should transform user form data and return the transformed user', async () => {
    const userFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      gender: 'male',
    };

    const encryptedPassword = 'encrypted-password';
    const transformedBirthdate = dayjs('1990-01-01');

    mockedHashString.mockResolvedValue(encryptedPassword);

    const transformedUser = await transformUserForm(userFormData);

    expect(transformedUser.firstName).toBe(userFormData.firstName);
    expect(transformedUser.lastName).toBe(userFormData.lastName);
    expect(transformedUser.email).toBe(userFormData.email);
    expect(transformedUser.password).toBe(encryptedPassword);
    expect(transformedUser.birthdate).toEqual(transformedBirthdate);
    expect(transformedUser.gender).toBe(Genders.MALE);
    expect(hashString).toHaveBeenCalledWith(userFormData.password);
  });

  it('should not transform gender when it is not a valid string', async () => {
    const userFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      gender: 1,
    };

    const encryptedPassword = 'encrypted-password';
    const transformedBirthdate = dayjs('1990-01-01');

    mockedHashString.mockResolvedValue(encryptedPassword);

    const transformedUser = await transformUserForm(userFormData);

    expect(transformedUser.firstName).toBe(userFormData.firstName);
    expect(transformedUser.lastName).toBe(userFormData.lastName);
    expect(transformedUser.email).toBe(userFormData.email);
    expect(transformedUser.password).toBe(encryptedPassword);
    expect(transformedUser.birthdate).toEqual(transformedBirthdate);
    expect(transformedUser.gender).toBe(1);
    expect(hashString).toHaveBeenCalledWith(userFormData.password);
  });
});
