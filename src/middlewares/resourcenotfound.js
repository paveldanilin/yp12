const logger = require('../logger');

module.exports = (req, res) => {
  logger.instance.error(`Resource not found [${req.url}]`);
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
};
