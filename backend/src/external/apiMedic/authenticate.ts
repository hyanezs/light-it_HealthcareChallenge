import crypto from 'node:crypto';
import { cacheKeys, findInCache, setInCache } from '../../dataAccess/cache';
import { logger } from '../../utils';
import { authApiMedic, healthApiMedic } from './instances';

const { API_MEDIC_AUTH_URL, API_MEDIC_USERNAME, API_MEDIC_PASSWORD } =
  process.env;

let interceptorId = -1;

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
    await setInCache(cacheKeys.apiMedicToken, token, 60 * 60 * 24 * 30);
    logger.debug('API_MEDIC token saved to cache');
    return response.data.Token as string;
  } catch (err: any) {
    console.log(err);
    return null;
  }
};

const authenticateApiMedic = async () => {
  logger.debug(
    'Checking if API_MEDIC token is in cache, to avoid constant auth req',
  );

  let token = await findInCache(cacheKeys.apiMedicToken);
  if (!token) {
    token = await acquireToken();
  }

  // Eject the previous interceptor if it exists
  if (interceptorId >= 0) {
    healthApiMedic.interceptors.request.eject(interceptorId);
  }

  // Default token and language for api communication
  interceptorId = healthApiMedic.interceptors.request.use((config) => {
    config.params = (config.params || {}) as Record<string, any>;
    config.params.token = token;
    config.params.language = 'en-gb';
    return config;
  });
};

export { authenticateApiMedic };
