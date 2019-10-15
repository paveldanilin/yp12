const logger = require('./logger');


const authenticate = (req, res, next) => {
  req.user = {
    _id: '5da580dc6d3e3b19348bbb68',
  };
  next();
};

const loggerMiddleware = (req, res, next) => {
  const msg = {
    level: 'info',
    message: `[${req.method}] ${req.url}`,
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
  authenticate,
};
