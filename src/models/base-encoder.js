class BaseEncoder {
  constructor() {
    if (new.target === BaseEncoder) {
      throw new TypeError('Cannot construct BaseEncoder instances directly');
    }

    if (this.encode === undefined) {
      throw new TypeError('Must override method "encode"');
    }

    if (this.decode === undefined) {
      throw new TypeError('Must override method "decode"');
    }
  }
}

module.exports = BaseEncoder;
