/* eslint-disable */
import type winston from 'winston';
import { createLogger, format } from 'winston';

const getColor = (infoLevel: string): string => {
  switch (infoLevel) {
    case 'error':
      return '\u001b[1;31m';
    case 'warn':
      return '\u001b[1;33m';
    case 'info':
      return '\u001b[1;36m';
    default:
      return '\x1b[30m';
  }
};

export const consoleLoggerFormat = format.combine(
  format.timestamp({
    format: 'HH:mm:ss.SSS',
  }),
  format.printf(
    (info: any) =>
      `\x1b[7m${info.timestamp} ${getColor(
        info.level,
      )} [${info.level?.toUpperCase()}] \x1b[0m ${
        info.sqlMessage
          ? JSON.stringify({
              message: info.message,
              sql: info.sqlMessage,
            })
          : info.message
      }${info.splat ?? ' '}`,
  ),
);

const logger: winston.Logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss.SSS',
    }),
    format.printf(
      (info: any) =>
        `${info.timestamp} - [${info.level?.toUpperCase()}]: ${
          info.stack
            ? JSON.stringify({
                message: info.message,
                error: info.error,
                sql: info.sqlMessage,
                stack: info.stack,
              })
            : info.message
        }${info.splat ?? ' '}`,
    ),
  ),
  silent: process.env.NODE_ENV === 'test',
});

export default logger;
