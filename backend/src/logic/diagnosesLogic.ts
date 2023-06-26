/* eslint-disable @typescript-eslint/naming-convention */
import axios, { type AxiosError } from 'axios';
import { cacheKeys, clearCachePreffix } from '../dataAccess/cache';
import { ServerError } from '../exceptions';
import { authenticateApiMedic } from '../external/apiMedic/authenticate';
import { endpoints, healthApiMedic } from '../external/apiMedic/instances';
import {
  type Diagnosis,
  type GetDiagnosesParams,
} from '../types/external/diagnoses';
import { logger } from '../utils';
import { validateGetDiagnosesParams } from '../validations';

type GetDiagnosesApiMedicParams = {
  symptoms: string;
  gender: string;
  year_of_birth: string;
};

const getDiagnoses = async (
  queryParams: GetDiagnosesParams,
): Promise<Diagnosis[] | undefined> => {
  validateGetDiagnosesParams(queryParams);

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
        return getDiagnoses(queryParams); // Retry the API call
      }
    }

    throw new ServerError('Error getting diagnoses from API Medic');
  }
};

export default getDiagnoses;
