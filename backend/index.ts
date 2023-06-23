import * as dotenv from 'dotenv';
dotenv.config();

import { initMasterDb } from './src/dataAccess/postgres';
import { initServer } from './src/server';
import { logger } from './src/utils';
import { initRedis } from './src/utils/cache';

(async () => {
  try {
    const successDb = await initMasterDb();
    if (!successDb) throw new Error('Databases init failed');

    const successCache = await initRedis();
    if (!successCache) throw new Error('Cache init failed.');

    await initServer();
  } catch (err: any) {
    logger.error(`Error initializing server: ${String(err)}`);
    process.exit(1);
  }
})();
