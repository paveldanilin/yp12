const BaseError = require('./base-error');

class ServerError extends BaseError {
  constructor(message = 'Internal server error', debug = null) {
    super(message, 500, debug);
  }
}

module.exports = ServerError;
