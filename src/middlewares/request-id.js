const uuid4 = require('uuid/v4');

module.exports = (req, res, next) => {
  if (!req.header('X-Request-Id')) {
    req.requestId = uuid4();
  } else {
    req.requestId = req.headers.get('X-Request-Id');
  }
  res.set('X-Request-Id', req.requestId);
  next();
};
