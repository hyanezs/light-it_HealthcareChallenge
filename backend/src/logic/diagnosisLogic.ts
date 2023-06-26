/* eslint-disable @typescript-eslint/naming-convention */
import axios, { type AxiosError } from 'axios';
import { cacheKeys, clearCachePreffix } from '../dataAccess/cache';
import { ServerError } from '../exceptions';
import { authenticateApiMedic } from '../external/apiMedic/authenticate';
import { healthApiMedic } from '../external/apiMedic/instances';
import {
  type Diagnosis,
  type GetDiagnosisParams,
} from '../types/external/diagnosis';
import { validateGetDiagnosisParams } from '../validations';

type GetDiagnosisApiMedicParams = {
  symptoms: string;
  gender: string;
  year_of_birth: string;
};

const getDiagnosis = async (
  queryParams: GetDiagnosisParams,
): Promise<Diagnosis[] | undefined> => {
  validateGetDiagnosisParams(queryParams);

  try {
    const params: GetDiagnosisApiMedicParams = {
      symptoms: `[${queryParams.symptomsIds.join(',')}]`,
      gender: queryParams.gender?.toString().toLowerCase(),
      year_of_birth: queryParams.birthyear?.toString(),
    };

    const response = await healthApiMedic.get<Diagnosis[]>('/diagnosis', {
      params,
    });
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
        return getDiagnosis(queryParams); // Retry the API call
      }
    }

    throw new ServerError('Error getting diagnosis from API Medic');
  }
};

export default getDiagnosis;
