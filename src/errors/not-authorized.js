const BaseError = require('./base-error');

class NotAuthorized extends BaseError {
  constructor(message = 'Request is not authorized', debug = null) {
    super(message, 401, debug);
  }
}

module.exports = NotAuthorized;
