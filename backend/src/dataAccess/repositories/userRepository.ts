import { type Dayjs } from 'dayjs';
import { type Genders } from '../../types/constants';
import { type UserModel } from '../../types/models';
import { type RegisterUser } from '../../types/requests';
import { User } from '../models';

export type PersistUser = Omit<RegisterUser, 'birthdate' | 'gender'> & {
  birthdate: Dayjs;
  gender: Genders;
};
const persistUser = async (user: PersistUser): Promise<UserModel> =>
  User.create(user);

const getUserByCondition = async <T extends Partial<UserModel>>(
  where: T,
  include: string[] = [],
): Promise<UserModel | null> =>
  User.findOne({
    where,
    include,
  });

const getUserById = async (
  id: number,
  include: string[] = [],
): Promise<UserModel | null> =>
  User.findByPk(id, {
    include,
  });

export { getUserByCondition, getUserById, persistUser };
