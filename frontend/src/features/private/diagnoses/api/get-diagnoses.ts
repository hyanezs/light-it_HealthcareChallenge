import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type DataResponse, type Diagnosis } from '../../../../types';

type GetDiagnosesParams = {
  symptomsIds: number[];
  gender?: string;
  birthyear?: number;
};

const getDiagnoses = async (
  params: GetDiagnosesParams
): Promise<DataResponse<Diagnosis[]> | undefined> => {
  try {
    const response = await internalApi.get<DataResponse<Diagnosis[]>>(endpoints.diagnoses, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export { getDiagnoses, type GetDiagnosesParams };
