import dayjs from 'dayjs';
import { User } from '../../dataAccess/models';
import {
  PersistUser,
  getUserByCondition,
  persistUser,
} from '../../dataAccess/repositories/userRepository';
import { Genders } from '../../types/constants';
import { UserModel } from '../../types/models';

const validUser: PersistUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  password: 'encrypted-password',
  birthdate: dayjs('1990-01-01'),
  gender: Genders.MALE,
};

const userInDb: Partial<UserModel> = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  password: 'encrypted-password',
  birthdate: dayjs('1990-01-01'),
  gender: Genders.MALE,
};

describe('persistUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should persist a user and return the created user model', async () => {
    jest.spyOn(User, 'create').mockResolvedValueOnce(userInDb);
    const result = await persistUser(validUser);
    expect(result).toBe(userInDb);
    expect(User.create).toHaveBeenCalledWith(validUser);
  });

  it('should throw an error when user persistence fails', async () => {
    const error = new Error('Persistence error');
    jest.spyOn(User, 'create').mockRejectedValueOnce(error);
    await expect(persistUser(validUser)).rejects.toThrow(error);
    expect(User.create).toHaveBeenCalledWith(validUser);
  });
});

describe('getUserByCondition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve a user by condition and return the user model', async () => {
    const condition = {
      email: 'john@example.com',
    };

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(userInDb as UserModel);

    const result = await getUserByCondition(condition);

    expect(result).toBe(userInDb);
    expect(User.findOne).toHaveBeenCalledWith({
      where: condition,
      include: [],
    });
  });

  it('should retrieve a user by condition with included associations', async () => {
    // TODO: Fix this test
    /* const condition = {
      email: 'john@example.com',
    };

    const includedAssociations = ['diagnoses'];

    const retrievedUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      diagnoses: [
        {
          id: 1,
          name: 'Diabetes',
        },
      ],
    };

    // mockedUser.findOne.mockResolvedValue(retrievedUser as UserModel);

    const result = await getUserByCondition(condition, includedAssociations);

    expect(result).toBe(retrievedUser);
    expect(User.findOne).toHaveBeenCalledWith({
      where: condition,
      include: includedAssociations,
    }); */
  });

  it('should return null when no user is found by condition', async () => {
    const condition = {
      email: 'john@example.com',
    };

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

    const result = await getUserByCondition(condition);

    expect(result).toBeNull();
    expect(User.findOne).toHaveBeenCalledWith({
      where: condition,
      include: [],
    });
  });
});
