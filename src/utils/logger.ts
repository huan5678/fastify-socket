import winston,  { LoggerOptions } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { FastifyLoggerOptions } from 'fastify';

const isProduction = process.env.NODE_ENV === "production";

const loggerOptions: LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'fastify-socket' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
};

const logger = winston.createLogger(loggerOptions);


const fastifyLogger: FastifyLoggerOptions = {
  level: logger.level,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      hostname: req.hostname,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: (err) => ({
      type: err.name,
      code: err.code,
      message: err.message,
      stack: err.stack || '',
    }),
  },
  stream: {
    write: (message) => {
      logger.info(message.trim());
    },
  },
};

export {logger as default, fastifyLogger};
