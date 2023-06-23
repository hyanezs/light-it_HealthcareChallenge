import { type Dayjs } from 'dayjs';
import { type Genders } from '../constants';

type RegisterUser = {
  firstName: string;
  lastName: string;
  gender: string | Genders;
  email: string;
  password: string;
  birthdate: string | Dayjs;
};

export default RegisterUser;
