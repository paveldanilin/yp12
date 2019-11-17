const logger = require('../logger');
const UserModel = require('../models/user');
const NotAuthorized = require('../errors/not-authorized');

module.exports = async (req, res, next) => {
  if (!req.header('Authorization')) {
    throw new NotAuthorized('Не указан токен');
  }
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    req.user = await UserModel.resolveToken(token);
    logger.debugLogger.debug(`${req.requestId} - User has been authorized ${req.user._id}`);
    return next();
  } catch (error) {
    throw new NotAuthorized(error);
  }
};
