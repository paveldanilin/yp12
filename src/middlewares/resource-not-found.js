const NotFound = require('../errors/not-found');

module.exports = (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден', `Resource not found [${req.url}]`));
};
