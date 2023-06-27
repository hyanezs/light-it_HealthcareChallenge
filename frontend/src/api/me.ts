import { type AxiosError } from 'axios';
import { endpoints, handleApiError, internalApi } from '../config/api';
import { type Me } from '../types';

const me = async (): Promise<Me | undefined> => {
  try {
    const response = await internalApi.get<Me>(endpoints.me);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error as AxiosError);
  }
};

export default me;
