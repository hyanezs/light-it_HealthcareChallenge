import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type SuccessResponse } from '../../../../types';

export type LoginRequest = {
  email: string;
  password: string;
};

const login = async (credentials: LoginRequest): Promise<SuccessResponse | undefined> => {
  try {
    const response = await internalApi.post<SuccessResponse>(
      endpoints.session + '/login',
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export default login;
