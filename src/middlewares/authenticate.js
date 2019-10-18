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
  if (process.env.TEST_USER_ID && process.env.TEST_USER_ID.trim().length > 0) {
    return authenticateByTestId(process.env.TEST_USER_ID, res, req, next);
  }
  return authenticateByHeader(req, req, next);
};
