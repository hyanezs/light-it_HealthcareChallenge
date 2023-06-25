import axios, { type AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { globalNavigate } from '../hooks/GlobalNavigation';
import { type Env } from '../types';

export const { VITE_API_URL } = import.meta.env as unknown as Env;

export const endpoints = {
  session: '/auth',
  me: '/me',
  symptoms: '/symptoms',
};

export const internalApi = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  baseURL: VITE_API_URL,
});

export const handleApiError = (error: AxiosError) => {
  console.log({ error });

  const data = error.response?.data as {
    error: string;
  };
  const message =
    data.error ??
    'Something went wrong on our side. Please try again later, or let us know if this issue persists.';

  console.error(error);
  toast.error(message);

  const status = error.response?.status;
  if (status === 401 || status === 403) {
    globalNavigate('/logout');
  }

  return null;
};
