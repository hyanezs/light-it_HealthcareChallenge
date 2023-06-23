/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type dayjs from 'dayjs';
import {
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type Model,
} from 'sequelize';
import { type Genders } from './constants';

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<number>;
  firstName: string;
  lastName: string;
  gender: Genders;
  birthdate: dayjs.Dayjs;
  email: string;
  password: string;
}

export type { UserModel };
