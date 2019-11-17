const Joi = require('joi');
const BadRequest = require('../errors/bad-request');

const schemaValidate = (schema) => (req, res, next) => {
  const { error } = Joi.validate(req.body, schema);
  if (error == null) {
    next();
  } else {
    const { details } = error;
    const message = details.map((i) => i.message).join(',');
    next(
      new BadRequest(
        `Ошибка в данных: ${message}`,
        `Could not validate entity [${JSON.stringify(req.body)}]. ${message}`,
      ),
    );
  }
};

module.exports = schemaValidate;
