import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type SuccessResponse } from '../../../../types';

const logout = async (): Promise<SuccessResponse | undefined> => {
  try {
    const response = await internalApi.post<SuccessResponse>(endpoints.session + '/logout');
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export default logout;
