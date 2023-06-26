import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type DataResponse, type DiagnosisRequest } from '../../../../types';

const getUsersDiagnosesHistory = async (): Promise<
  DataResponse<DiagnosisRequest[]> | undefined
> => {
  try {
    const response = await internalApi.get<DataResponse<DiagnosisRequest[]>>(
      endpoints.diagnoses + '/history'
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export { getUsersDiagnosesHistory };
