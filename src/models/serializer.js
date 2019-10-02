class Serializer {
  constructor(encoder) {
    this.encoder = encoder;
    this.normalizers = {};
  }

  registerNormalizer(type, normalizer) {
    this.normalizers[type] = normalizer;
  }

  deserialize(data, type) {
    let toBeParsedData = data;
    if (typeof data === 'string') {
      toBeParsedData = this.encoder.decode(data);
    }
    const normalizer = this.normalizers[type] || null;
    if (normalizer) {
      return normalizer.denormalize(toBeParsedData, this);
    }
    return null;
  }

  serialize(obj, type) {
    const normalizer = this.normalizers[type] || null;
    if (normalizer) {
      return normalizer.normalize(obj, this);
    }
    return null;
  }
}

module.exports = Serializer;
