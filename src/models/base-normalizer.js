const BaseCollection = require('./base-collection');

class BaseNormalizer {
  constructor(type) {
    if (new.target === BaseNormalizer) {
      throw new TypeError('Cannot construct BaseNormalizer instances directly');
    }

    this.type = type;

    if (this.supportNormalization === undefined) {
      throw new TypeError('Must override method "supportNormalization"');
    }

    if (this.doNormalize === undefined) {
      throw new TypeError('Must override method "doNormalize"');
    }

    if (this.supportDenormalization === undefined) {
      throw new TypeError('Must override method "supportDenormalization"');
    }

    if (this.doDenormalize === undefined) {
      throw new TypeError('Must override method "doDenormalize"');
    }

    if (this.doDenormalizeArray === undefined) {
      throw new TypeError('Must override method "doDenormalizeArray"');
    }
  }

  normalize(data, serializer) {
    let forNormalization = data;
    if (data instanceof BaseCollection) {
      forNormalization = data.toArray();
    }
    if (Array.isArray(forNormalization)) {
      return forNormalization.map((el) => this.normalize(el, serializer));
    }
    if (!this.supportNormalization(data)) {
      return false;
    }
    return this.doNormalize(data, serializer);
  }

  denormalize(data, serializer) {
    const forNormalization = data;
    if (Array.isArray(forNormalization)) {
      return this.doDenormalizeArray(forNormalization.filter(
        (el) => this.supportDenormalization(el, this.type),
      ), serializer);
    }
    if (!this.supportDenormalization(forNormalization, this.type)) {
      return false;
    }
    return this.doDenormalize(forNormalization, this.type, serializer);
  }
}

module.exports = BaseNormalizer;
