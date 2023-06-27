import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type DataResponse, type DiagnosisRequest } from '../../../../types';

type DiagnosisRequestUpdate = {
  confirmed: boolean;
};

const updateDiagnosis = async (
  id: number,
  data: DiagnosisRequestUpdate
): Promise<DataResponse<DiagnosisRequest> | undefined> => {
  try {
    const response = await internalApi.put<DataResponse<DiagnosisRequest>>(
      `${endpoints.diagnoses}/${id}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export default updateDiagnosis;
