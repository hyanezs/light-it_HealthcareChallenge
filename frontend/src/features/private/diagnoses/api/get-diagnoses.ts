import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type DataResponse, type Diagnosis } from '../../../../types';

type GetDiagnosesReqBody = {
  symptomsIds: number[];
  gender?: string;
  birthyear?: number;
};

const getDiagnoses = async (
  body: GetDiagnosesReqBody
): Promise<DataResponse<Diagnosis[]> | undefined> => {
  try {
    const response = await internalApi.post<DataResponse<Diagnosis[]>>(endpoints.diagnoses, body);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export { getDiagnoses, type GetDiagnosesReqBody };
