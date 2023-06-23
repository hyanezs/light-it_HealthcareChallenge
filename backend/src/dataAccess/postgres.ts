import { Sequelize } from 'sequelize';
import { logger } from '../utils';

const config = {
  name: process.env.POSTGRESQL_NAME!,
  user: process.env.POSTGRESQL_USER!,
  password: process.env.POSTGRESQL_PASSWORD,
  host: process.env.POSTGRESQL_HOST,
  recreate: process.env.POSTGRESQL_RECREATE === 'true',
};

const masterDb = new Sequelize(config.name, config.user, config.password, {
  host: config.host,
  dialect: 'postgres',
});

const initMasterDb = async () => {
  try {
    logger.info('Trying to connect to postgreSQL db.');
    await masterDb.authenticate();
    await masterDb.sync({ force: config.recreate });

    logger.info(
      'Connection to postgreSQL db has been established successfully.',
    );
    return true;
  } catch (error) {
    logger.info('Unable to connect to postgreSQL db:', error);
    return false;
  }
};

const isDbUp = async () => {
  try {
    await masterDb.authenticate();
    return 'Database (postgreSQL) is accepting connections.';
  } catch (error) {
    logger.info('Unable to connect to postgreSQL db:', error);
    return 'Database (postgreSQL) is down.';
  }
};

export { initMasterDb, isDbUp, masterDb };
