class BaseCollection {
  constructor(type, schema = null) {
    if (new.target === BaseCollection) {
      throw new TypeError('Cannot construct BaseCollection instances directly');
    }

    this.schema = schema;
    this.type = type;
    this.items = [];

    if (this.supportedType === undefined) {
      throw new TypeError('Must override method "supportedType"');
    }

    if (this.fromArray === undefined) {
      throw new TypeError('Must override method "fromArray"');
    }
  }

  toArray() {
    return this.items;
  }

  size() {
    return this.items.length;
  }

  get(index) {
    return this.items[index] || null;
  }

  add(item) {
    if (!this.supportedType(item)) {
      throw new Error(`Item must be type of [${this.type}]`);
    }
    this.items.push(item);
    return this;
  }

  /**
   * @param value
   * @returns {boolean}
   */
  remove(value) {
    if (typeof value === 'object') {
      return this.removeByPredicate(value);
    }
    return this.removeByScalar(value);
  }

  /**
   * @param value
   * @returns {boolean}
   */
  removeByScalar(value) {
    const beforeLength = this.items.length;
    this.items = this.items.filter((item) => item !== value);
    return this.items.length !== beforeLength;
  }

  /**
   * @param predicate
   * @returns {boolean}
   */
  removeByPredicate(predicate) {
    if (typeof predicate !== 'object') {
      throw new Error('Predicate must be an object');
    }

    const keys = Object.keys(predicate);
    keys.forEach((key) => this.checkFieldBySchema(key));

    const beforeLength = this.items.length;
    this.items = this.items.filter((item) => !this.checkPredicate(predicate, item));
    return this.items.length !== beforeLength;
  }

  findBy(value) {
    if (typeof value === 'object') {
      return this.findByPredicate(value);
    }
    return this.findByScalar(value);
  }

  findByScalar(value) {
    return this.fromArray(this.items.filter((item) => item === value));
  }

  findByPredicate(predicate) {
    if (typeof predicate !== 'object') {
      throw new Error('Predicate must be an object');
    }

    const keys = Object.keys(predicate);
    keys.forEach((key) => this.checkFieldBySchema(key));

    // And
    return this.fromArray(this.items.filter((item) => this.checkPredicate(predicate, item)));
  }

  // eslint-disable-next-line class-methods-use-this
  checkPredicate(predicate, item) {
    const keys = Object.keys(predicate);
    let result = true;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keys.length; i++) {
      const fieldName = keys[i];
      if (predicate[fieldName] !== item[fieldName]) {
        result = false;
        break;
      }
    }
    return result;
  }

  checkFieldBySchema(field) {
    if (!this.schema) {
      return;
    }
    if (!this.schema[field]) {
      throw new Error(`Unsupported field ${field} by schema ${JSON.stringify(this.schema)}`);
    }
  }
}

module.exports = BaseCollection;
