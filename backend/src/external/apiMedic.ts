import axios, { type AxiosInstance } from 'axios';
import crypto from 'crypto';
import { cacheKeys, findInCache, setInCache } from '../dataAccess/cache';
import { logger } from '../utils';

const {
  API_MEDIC_AUTH_URL,
  API_MEDIC_HEALTH_URL,
  API_MEDIC_USERNAME,
  API_MEDIC_PASSWORD,
} = process.env;

const authApiMedic: AxiosInstance = axios.create({
  baseURL: API_MEDIC_AUTH_URL,
});

export const healthApiMedic: AxiosInstance = axios.create({
  baseURL: API_MEDIC_HEALTH_URL,
});

const encryptPassword = (password: string) => {
  const hmac = crypto.createHmac('md5', password);
  hmac.update(`${API_MEDIC_AUTH_URL!}/login`);
  return hmac.digest('base64');
};

const acquireToken = async () => {
  try {
    if (!API_MEDIC_AUTH_URL) {
      throw new Error('API_MEDIC_AUTH_URL is not defined');
    }

    if (!API_MEDIC_USERNAME || !API_MEDIC_PASSWORD) {
      throw new Error('API_MEDIC Credentials are not defined');
    }

    logger.debug('Acquiring API_MEDIC token');
    const response = await authApiMedic.post(
      `/login`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_MEDIC_USERNAME}:${encryptPassword(
            API_MEDIC_PASSWORD,
          )}`,
        },
      },
    );
    logger.debug('API_MEDIC token acquired');
    const token = response.data.Token as string;
    logger.debug('Saving API_MEDIC token to cache - TTL 30 days');
    const cache = await setInCache(
      cacheKeys.apiMedicToken,
      token,
      60 * 60 * 24 * 30,
    );
    logger.debug('API_MEDIC token saved to cache');
    return response.data.Token as string;
  } catch (err: any) {
    console.log(err);
  }
};

const authenticateApiMedic = async () => {
  logger.debug(
    'Checking if API_MEDIC token is in cache, to avoid constant auth req',
  );

  const existingToken = await findInCache(cacheKeys.apiMedicToken);
  if (existingToken) {
    healthApiMedic.interceptors.request.use((config) => {
      config.params.token = existingToken;
      return config;
    });
  }

  const token = await acquireToken();
  healthApiMedic.interceptors.request.use((config) => {
    config.params.token = token;
    return config;
  });
};

export { authenticateApiMedic };
