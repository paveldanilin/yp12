const logger = require('../logger');
const UserModel = require('../models/user');

function authenticateByHeader(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(400).send({ message: 'Не указан токен' });
  }
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    req.user = UserModel.loadUserByToken(token);
    req.token = token;
    return next();
  } catch (error) {
    return res.status(401).send({ error: 'Not authorized' });
  }
}

// Заглушка, как по заданию
function authenticateByTestId(testUserId, req, res, next) {
  req.user = {
    _id: testUserId,
  };
  next();
}

module.exports = (req, res, next) => {
  const testUserId = process.env.TEST_USER_ID;
  if (testUserId && testUserId.trim().length > 0) {
    logger.instance.debug(
      `Test user id is defined in the .env file, going to call an authenticate stub. [${testUserId}]`,
    );
    return authenticateByTestId(process.env.TEST_USER_ID, req, res, next);
  }
  logger.instance.debug('Going to call authenticate by token');
  return authenticateByHeader(req, res, next);
};
