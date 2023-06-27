/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type Dayjs } from 'dayjs';
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
  birthdate: Dayjs;
  email: string;
  password: string;
}

interface DiagnosisModel
  extends Model<
    InferAttributes<DiagnosisModel>,
    InferCreationAttributes<DiagnosisModel>
  > {
  id: CreationOptional<number>;
  issueId: number;
  name: string;
  accuracy: number;
  profName: string;
  icd: string;
  icdName: string;
  specialisationIds: string;
  confirmed: boolean;
}

interface DiagnosesRequestModel
  extends Model<
    InferAttributes<DiagnosesRequestModel>,
    InferCreationAttributes<DiagnosesRequestModel>
  > {
  id: CreationOptional<number>;
  requestedOn: Date;
  possibleDiagnoses?: DiagnosisModel[];
  user?: UserModel;
  userId: number;
  birthyear: number;
  gender: Genders;
  symptomsIds: string; // Comma separated array - queryparam
}

export type { DiagnosesRequestModel, DiagnosisModel, UserModel };
