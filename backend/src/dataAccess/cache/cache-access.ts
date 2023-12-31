/* eslint-disable @typescript-eslint/ban-types */
import { createClient } from 'redis';
import logger from '../../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL!,
  socket: {
    reconnectStrategy(_) {
      return false;
    },
  },
});

const initRedis = async () => {
  try {
    logger.debug('Trying to connect to Redis Cache');
    redisClient.on('error', (err: any) =>
      logger.error('Redis Client Error', err),
    );

    if (process.env.environment !== 'production') {
      await redisClient.connect();
    }

    logger.debug('Redis Cache connected successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to Redis database:', error);
    return false;
  }
};

const findInCache = async (cacheId: string): Promise<string | null> => {
  const inCache = await redisClient.get(cacheId);
  if (inCache) logger.debug(`Cache hit, key: ${cacheId}.`);
  else logger.debug(`Cache miss, key: ${cacheId}`);
  return inCache;
};

const setInCache = async (
  cacheId: string,
  cacheItem: string,
  ttl?: number,
): Promise<string> => {
  logger.debug(`Set ${cacheId} in cache.`);
  const cacheTtl = ttl ?? 3600;

  return redisClient.setEx(cacheId, cacheTtl, cacheItem);
};

const clearCache = async (cacheId: string): Promise<void> => {
  await redisClient.del(cacheId);
};

const clearCachePreffix = async (preffix: string): Promise<void> => {
  const keysMatching = await redisClient.keys(`${preffix}*`);
  await Promise.all(keysMatching.map(async (key) => redisClient.del(key)));
};

const isCacheUp = async () => {
  if (redisClient.on('connect', () => true)) {
    return `Cache (redis) is connected.`;
  }

  return `Cache (redis) is down.`;
};

export {
  clearCache,
  clearCachePreffix,
  findInCache,
  initRedis,
  isCacheUp,
  setInCache,
};
