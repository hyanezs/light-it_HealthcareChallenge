import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type DataResponse, type Symptom } from '../../../../types';

const getSymptoms = async (): Promise<DataResponse<Symptom[]> | undefined> => {
  try {
    const response = await internalApi.get<DataResponse<Symptom[]>>(endpoints.symptoms);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export default getSymptoms;
