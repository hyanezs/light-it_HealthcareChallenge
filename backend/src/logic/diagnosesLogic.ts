/* eslint-disable @typescript-eslint/naming-convention */
import axios, { type AxiosError } from 'axios';
import dayjs from 'dayjs';
import { cacheKeys, clearCachePreffix } from '../dataAccess/cache';
import {
  getDiagnosesRequestsByCondition,
  persistDiagnosesRequest,
} from '../dataAccess/repositories/diagnosesRequestRepository';
import { ServerError } from '../exceptions';
import { authenticateApiMedic } from '../external/apiMedic/authenticate';
import { endpoints, healthApiMedic } from '../external/apiMedic/instances';
import transformDiagnosisResponse from '../external/apiMedic/utils';
import {
  type Diagnosis,
  type GetDiagnosesParams,
} from '../types/external/external-diagnosis';
import { type DiagnosesRequestModel, type UserModel } from '../types/models';
import { getGenderFromString, logger } from '../utils';
import { validateGetPossibleDiagnosesParams } from '../validations';

type GetDiagnosesApiMedicParams = {
  symptoms: string;
  gender: string;
  year_of_birth: string;
};

const getPossibleDiagnoses = async (
  queryParams: GetDiagnosesParams,
  user: UserModel,
): Promise<Diagnosis[] | undefined> => {
  validateGetPossibleDiagnosesParams(queryParams);

  try {
    const params: GetDiagnosesApiMedicParams = {
      symptoms: `[${queryParams.symptomsIds.join(',')}]`,
      gender: queryParams.gender?.toString().toLowerCase(),
      year_of_birth: queryParams.birthyear?.toString(),
    };

    logger.debug(JSON.stringify({ GetDiagnosis: params }));

    const response = await healthApiMedic.get<Diagnosis[]>(
      endpoints.diagnosis,
      {
        params,
      },
    );

    const possibleDiagnoses = transformDiagnosisResponse(response.data);

    await persistDiagnosesRequest({
      symptomsIds: queryParams.symptomsIds.join(','),
      birthyear: parseInt(queryParams.birthyear, 10),
      requestedOn: dayjs().toDate(),
      gender: getGenderFromString(queryParams.gender),
      possibleDiagnoses,
      user,
      userId: user.id,
    } as DiagnosesRequestModel);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      if (
        axiosError.response?.status === 400 &&
        (axiosError.response?.data as string)
          .toLowerCase()
          .includes('invalid token')
      ) {
        await clearCachePreffix(cacheKeys.apiMedicToken);
        await authenticateApiMedic(); // Implement token refresh logic
        return getPossibleDiagnoses(queryParams, user); // Retry the API call
      }
    }

    logger.error(JSON.stringify({ getPossibleDiagnoses: error }));
    throw new ServerError('Error getting diagnoses from API Medic');
  }
};

const getUsersDiagnosesHistory = async (
  user?: UserModel,
): Promise<DiagnosesRequestModel[] | undefined> => {
  if (!user) throw new ServerError('User not found and should be set');

  const history = await getDiagnosesRequestsByCondition({ userId: user.id });
  return history ?? [];
};

export { getPossibleDiagnoses, getUsersDiagnosesHistory };
