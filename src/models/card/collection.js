const Card = require('./card');
const BaseCollection = require('../base-collection');

class CardCollection extends BaseCollection {
  constructor(users = []) {
    super('Card', {
      id: 'string',
      name: 'string',
      link: 'string',
      createdAt: 'datetime',
      owner: 'User',
      likes: 'array',
    });

    users.forEach((card) => this.add(card));
  }

  // eslint-disable-next-line class-methods-use-this
  supportedType(item) {
    return item instanceof Card;
  }

  // eslint-disable-next-line class-methods-use-this
  fromArray(array) {
    return new CardCollection(array);
  }
}

module.exports = CardCollection;
