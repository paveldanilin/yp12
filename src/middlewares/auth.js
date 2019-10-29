const logger = require('../logger');
const UserModel = require('../models/user');

module.exports = async (req, res, next) => {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Не указан токен' });
  }
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    req.user = await UserModel.resolveToken(token);
    logger.instance.debug(`User has been athorized ${req.user._id}`);
    return next();
  } catch (error) {
    logger.instance.error(error);
    return res.status(401).send({ error: 'Not authorized' });
  }
};
