const BaseError = require('./base-error');

class BadRequest extends BaseError {
  constructor(message = 'The requested resource not found', debug = null) {
    super(message, 400, debug);
  }
}

module.exports = BadRequest;
