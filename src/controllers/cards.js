const CardModel = require('../models/card');
const logger = require('../logger');
const to = require('../utils/to');

module.exports.getAll = async (req, res) => {
  const [err, cards] = await to(CardModel.find({}).populate('owner'));

  if (!cards) {
    logger.instance.error(`Could not get cards. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка получения списка карточек' });
  }

  return res.send(cards);
};

module.exports.getById = async (req, res) => {
  const [err, card] = await to(CardModel.findById(req.params.id));

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

  return res.status(201).send(card);
};

module.exports.delete = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const [err, query] = await to(CardModel.findByIdAndRemove(req.params.id));

  if (!query) {
    logger.instance.error(`Could not delete unknown card ${req.params.id}`);
    return res.status(404).send({ message: 'Карточка не найдена' });
  }

  logger.instance.info(`Card with id ${req.params.id} has been deleted`);
  return res.send({ message: 'Карточка удален' });
};


module.exports.update = async (req, res) => {
  const [err, query] = await to(
    CardModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }),
  );

  if (!query) {
    logger.instance.error(`Could not update card. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка обновления карточки' });
  }

  if (query.n === 0) {
    logger.instance.warn(`Could not update card with id ${req.params.id}`);
    return res.status(404).send({ message: 'Карточка не существует' });
  }

  if (query.nModified === 0) {
    logger.instance.warn(`Nothing to update at card id ${req.params.id}`);
    return res.status(304).send();
  }

  logger.instance.info(
    `Card with id ${req.params.id} has been updated (nm=${query.nModified})`,
  );

  return res.send({ message: 'Карточка обновлена' });
};
