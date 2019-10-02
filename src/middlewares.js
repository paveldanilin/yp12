const logger = require('./logger');

const loggerMiddleware = (req, res, next) => {
  const msg = {
    level: 'info',
    message: `[${req.method}] ${req.url} Headers: ${JSON.stringify(req.headers)}`,
  };
  logger.instance.log(msg);
  next();
};

const routeNotFoundMiddleware = (req, res) => {
  logger.instance.error(`Resource not found [${req.url}]`);
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
};

module.exports = {
  loggerMiddleware,
  routeNotFoundMiddleware,
};
