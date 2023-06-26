import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type DataResponse, type Diagnosis } from '../../../../types';

type GetDiagnosisParams = {
  symptomsIds: number[];
  gender?: string;
  birthyear?: number;
};

const getDiagnosis = async (
  params: GetDiagnosisParams
): Promise<DataResponse<Diagnosis[]> | undefined> => {
  try {
    const response = await internalApi.get<DataResponse<Diagnosis[]>>(endpoints.diagnosis, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export { getDiagnosis, type GetDiagnosisParams };
