class BaseError extends Error {
  constructor(message, statusCode, debug = null) {
    super(message);
    this.statusCode = statusCode;
    this.debug = debug;
  }
}

module.exports = BaseError;
