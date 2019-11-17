const winston = require('winston');

// TODO: we should use categories

const errorLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error', dirname: 'logs' }),
  ],
});

const requestLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'request.log', level: 'info', dirname: 'logs' }),
  ],
});

const debugLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'debug.log', level: 'debug', dirname: 'logs' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.simple(),
  });
  errorLogger.add(consoleTransport);
  requestLogger.add(consoleTransport);
  debugLogger.add(consoleTransport);
}

module.exports = {
  errorLogger,
  requestLogger,
  debugLogger,
};
