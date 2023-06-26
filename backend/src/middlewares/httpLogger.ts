import morgan from 'morgan';
import { logger } from '../utils';

const stream = {
  write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

const skip = () => false;

export default morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream, skip },
);
