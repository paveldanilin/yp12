const BaseError = require('./base-error');

class PermissionDenied extends BaseError {
  constructor(message = 'Access to the resource is denied', debug = null) {
    super(message, 403, debug);
  }
}

module.exports = PermissionDenied;
