import axios, { type AxiosInstance } from 'axios';

const { API_MEDIC_AUTH_URL, API_MEDIC_HEALTH_URL } = process.env;

export const authApiMedic: AxiosInstance = axios.create({
  baseURL: API_MEDIC_AUTH_URL ?? '',
});

export const healthApiMedic: AxiosInstance = axios.create({
  baseURL: API_MEDIC_HEALTH_URL,
});
