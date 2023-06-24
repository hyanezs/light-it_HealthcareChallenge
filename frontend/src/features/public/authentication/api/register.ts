import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../../../../config/api';
import { type SuccessResponse } from '../../../../types';
import { type Genders } from '../../../../types/constants';

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  gender: Genders;
  email: string;
  password: string;
  birthdate: string;
};

const register = async (credentials: RegisterRequest): Promise<SuccessResponse | undefined> => {
  try {
    const response = await internalApi.post<SuccessResponse>(
      endpoints.session + '/register',
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export default register;
