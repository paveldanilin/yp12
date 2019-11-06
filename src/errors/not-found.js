const BaseError = require('./base-error');

class NotFound extends BaseError {
  constructor(message = 'The requested resource not found', debug = null) {
    super(message, 404, debug);
  }
}

module.exports = NotFound;
