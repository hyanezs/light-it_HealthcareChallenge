import axios, { type AxiosError } from 'axios';
import { cacheKeys, clearCachePreffix } from '../dataAccess/cache';
import { type Symptom } from '../types';
import { authenticateApiMedic, healthApiMedic } from './../external/apiMedic';

const getSymptoms = async (): Promise<Symptom[] | undefined> => {
  try {
    const response = await healthApiMedic.get<Symptom[]>('/symptoms');

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      if (
        axiosError.response?.status === 400 &&
        axiosError.response.data === 'Missing or invalid token'
      ) {
        await clearCachePreffix(cacheKeys.apiMedicToken);
        await authenticateApiMedic(); // Implement token refresh logic
        return getSymptoms(); // Retry the API call
      }
    }

    throw error;
  }
};

export { getSymptoms };
