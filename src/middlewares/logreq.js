const logreq = require('../logger');

module.exports = (req, res, next) => {
  const msg = {
    level: 'info',
    message: `[${req.method}] ${req.url}`,
  };
  logreq.instance.log(msg);
  next();
};
