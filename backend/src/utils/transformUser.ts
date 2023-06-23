import dayjs from 'dayjs';
import { Genders } from '../types/constants';
import { type RegisterUser } from '../types/requests';
import { hashString } from './bcrypt';

const transformUserForm = async (
  userFormData: RegisterUser,
): Promise<RegisterUser> => {
  const user: RegisterUser = { ...userFormData };

  const encryptedPassword: string = await hashString(userFormData.password);

  user.password = encryptedPassword;
  user.birthdate = dayjs(userFormData.birthdate);

  if (typeof userFormData.gender === 'string') {
    const gender = Object.keys(Genders).find(
      (g) => g === userFormData.gender.toString().toUpperCase(),
    );

    user.gender = Object.entries(Genders).find(
      ([key]) => key === gender,
    )?.[1] as string;
  }

  return user;
};

export default transformUserForm;
