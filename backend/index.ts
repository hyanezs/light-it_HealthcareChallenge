import * as dotenv from 'dotenv';
dotenv.config();

import { initRedis } from './src/dataAccess/cache/cache-access';
import { initMasterDb } from './src/dataAccess/postgres';
import { authenticateApiMedic } from './src/external/apiMedic/authenticate';
import { initServer } from './src/server';
import { logger } from './src/utils';

(async () => {
  try {
    const connectedDb = await initMasterDb();
    if (!connectedDb) throw new Error('Databases init failed');

    const connectedCache = await initRedis();
    if (!connectedCache) throw new Error('Cache init failed.');

    await authenticateApiMedic();

    await initServer();
  } catch (err: any) {
    logger.error(`Error initializing server: ${String(err)}`);
    process.exit(1);
  }
})();
