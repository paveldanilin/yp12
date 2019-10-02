const BaseEncoder = require('./base-encoder');

class JsonEncoder extends BaseEncoder {
  // eslint-disable-next-line class-methods-use-this
  encode(data) {
    return JSON.stringify(data);
  }

  // eslint-disable-next-line class-methods-use-this
  decode(json) {
    return JSON.parse(json);
  }
}

module.exports = JsonEncoder;
