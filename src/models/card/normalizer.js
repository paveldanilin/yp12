const moment = require('moment-timezone');
const Card = require('./card');
const CardCollection = require('./collection');
const BaseNormalizer = require('../base-normalizer');

class CardNormalizer extends BaseNormalizer {
  constructor() {
    super(Card);
  }

  // eslint-disable-next-line class-methods-use-this
  supportNormalization(obj) {
    return obj instanceof Card;
  }

  // eslint-disable-next-line class-methods-use-this
  doNormalize(obj, serializer) {
    return {
      _id: obj.getId(),
      name: obj.getName(),
      link: obj.getLink(),
      createdAt: obj.getCreatedAt(),
      owner: serializer.serialize(obj.getOwner(), 'User'),
      likes: serializer.serialize(obj.getLikes(), 'User'),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  supportDenormalization(data) {
    // eslint-disable-next-line
    return (data._id || data.id) && data.name && data.owner;
  }

  // eslint-disable-next-line class-methods-use-this
  doDenormalize(data, type, serializer) {
    // TODO: Check is data suitable for demoralization?
    return Card.create({
      // eslint-disable-next-line
      id: data._id || data.id || null,
      name: data.name,
      link: data.link,
      createdAt: moment(data.createdAt),
      owner: serializer.deserialize(data.owner, 'User'),
      likes: serializer.deserialize(data.likes, 'User'),
    });
  }

  doDenormalizeArray(array, serializer) {
    return new CardCollection(
      array.map((cardData) => this.doDenormalize(cardData, null, serializer)),
    );
  }
}

module.exports = CardNormalizer;
