const jwt = require('jsonwebtoken');
const logger = require('../logger');
const UserModel = require('../models/user');

// eslint-disable-next-line consistent-return
const authenticate = async (req, res, next) => {
  if (!req.header('Authorization')) {
    return res.status(400).send({ message: 'Не указан токен' });
  }

  const token = req.header('Authorization').replace('Bearer ', '');
  let payload = null;

  try {
    payload = jwt.verify(token, process.env.JWT_KEY);
  } catch (e) {
    return res.status(400).send({ error: 'Bad token' });
  }

  try {
    const user = await UserModel.findOne({ _id: payload._id, 'tokens.token': token });
    if (!user) {
      throw new Error('Unknown user');
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized' });
  }
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
