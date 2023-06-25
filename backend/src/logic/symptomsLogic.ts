import axios, { type AxiosError } from 'axios';
import {
  cacheKeys,
  clearCachePreffix,
  findInCache,
  setInCache,
} from '../dataAccess/cache';
import { ServerError } from '../exceptions';
import { authenticateApiMedic } from '../external/apiMedic/authenticate';
import { healthApiMedic } from '../external/apiMedic/instances';
import { type Symptom } from '../types';
import { logger } from '../utils';

const getSymptoms = async (): Promise<Symptom[] | undefined> => {
  logger.debug('Checking cache for symptoms from API Medic');
  const stringifiedSymptoms = await findInCache(cacheKeys.apiMedicSymptoms);

  if (stringifiedSymptoms) return JSON.parse(stringifiedSymptoms) as Symptom[];

  try {
    logger.debug('Symptoms not found in cache, getting from API Medic');
    const response = await healthApiMedic.get<Symptom[]>('/symptoms');
    logger.debug('Saving symptoms from API Medic to cache - TTL 1 day');
    await setInCache(
      cacheKeys.apiMedicSymptoms,
      JSON.stringify(response.data),
      60 * 60 * 24,
    );

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

    throw new ServerError('Error getting symptoms from API Medic');
  }
};

export { getSymptoms };
