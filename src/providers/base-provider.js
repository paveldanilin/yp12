class BaseProvider {
  constructor() {
    if (new.target === BaseProvider) {
      throw new TypeError('Cannot construct BaseProvider instances directly');
    }

    if (this.doLoad === undefined) {
      throw new TypeError('Must override method "doLoad"');
    }
  }

  load(options, onError, onData) {
    this.doLoad(options, onError, onData);
  }
}

module.exports = BaseProvider;
