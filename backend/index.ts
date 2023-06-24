import * as dotenv from 'dotenv';
dotenv.config();

import { initRedis } from './src/dataAccess/cache/cache-access';
import { initMasterDb } from './src/dataAccess/postgres';
import { acquireToken } from './src/external/apiMedic';
import { initServer } from './src/server';
import { logger } from './src/utils';

(async () => {
  try {
    const connectedDb = await initMasterDb();
    if (!connectedDb) throw new Error('Databases init failed');

    const connectedCache = await initRedis();
    if (!connectedCache) throw new Error('Cache init failed.');

    const authenticateApiMedic = await acquireToken();
    if (!authenticateApiMedic) logger.error('ApiMedic authentication failed.');

    await initServer();
  } catch (err: any) {
    logger.error(`Error initializing server: ${String(err)}`);
    process.exit(1);
  }
})();
