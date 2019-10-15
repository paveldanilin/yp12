const CardModel = require('../models/card');
const logger = require('../logger');
const to = require('../utils/to');

module.exports.getAll = async (req, res) => {
  const [err, cards] = await to(
    CardModel
      .find({}, '-__v')
      .populate({ path: 'owner', select: '-password -tokens -__v' })
      .populate({ path: 'likes', select: '-password -tokens -__v' }),
  );

  if (!cards) {
    logger.instance.error(`Could not get cards. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка получения списка карточек' });
  }

  return res.send(cards);
};

module.exports.getById = async (req, res) => {
  const [err, card] = await to(
    CardModel
      .findById(req.params.id)
      .populate({ path: 'owner', select: '-password -tokens -__v' })
      .populate({ path: 'likes', select: '-password -tokens -__v' }),
  );

  if (!card) {
    logger.instance.error(`Could not get card with id ${req.params.id}. Reason: ${err}`);
    return res.status(404).send({ message: 'Ошибка при извлечении карточки' });
  }

  return res.send(card);
};

module.exports.create = async (req, res) => {
  const { name, link } = req.body;

  const [err, card] = await to(CardModel.create({ name, link, owner: req.user._id }));

  if (!card) {
    logger.instance.error(`Could not create card. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка при создании карточки' });
  }

  return res.status(201).send({ id: card._id });
};

module.exports.delete = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const [err, query] = await to(CardModel.findByIdAndRemove(req.params.id));

  if (!query) {
    logger.instance.error(`Could not delete unknown card with id ${req.params.id}`);
    return res.status(404).send({ message: 'Карточка не найдена' });
  }

  logger.instance.info(`Card with id ${req.params.id} has been deleted`);
  return res.send({ message: 'Карточка удален' });
};


module.exports.update = async (req, res) => {
  // eslint-disable-next-line no-unused-vars,max-len
  const [err, card] = await to(CardModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }));

  if (!card) {
    logger.instance.error(`Could not update unknown card with id ${req.params.id}`);
    return res.status(500).send({ message: 'Ошибка обновления карточки' });
  }

  logger.instance.info(`Card with id ${req.params.id} has been updated`);
  return res.send(card);
};

module.exports.like = async (req, res) => {
  const [err, card] = await to(
    CardModel.findByIdAndUpdate(
      req.params.id, { $addToSet: { likes: req.user._id } }, { new: true },
    ),
  );

  if (!card) {
    logger.instance.error(`Could not set like on card ${req.params.id}, Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка установки лайка' });
  }

  return res.send(card);
};

module.exports.dislike = async (req, res) => {
  const [err, card] = await to(
    CardModel.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true }),
  );

  if (!card) {
    logger.instance.error(`Could not remove like on card ${req.param.id}. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка снятия лайка' });
  }

  return res.send(card);
};
