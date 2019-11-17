const CardModel = require('../models/card');
const logger = require('../logger');
const to = require('../utils/to');
const ServerError = require('../errors/server-error');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const PermissionDenied = require('../errors/permission-denied');


async function getAllCards(req, res) {
  const [err, cards] = await to(
    CardModel
      .find({}, '-__v')
      .populate({ path: 'owner', select: '-password -tokens -__v' })
      .populate({ path: 'likes', select: '-password -tokens -__v' }),
  );

  if (!cards) {
    throw new ServerError('Ошибка получения списка карточек.', `Could not get cards. Reason: ${err}`);
  }

  return res.send(cards);
}

async function getCardById(req, res) {
  const [err, card] = await to(
    CardModel
      .findById(req.params.id)
      .populate({ path: 'owner', select: '-password -tokens -__v' })
      .populate({ path: 'likes', select: '-password -tokens -__v' }),
  );

  if (!card) {
    throw new NotFound(
      'Ошибка получения списка карточек.',
      `Could not get card with id ${req.params.id}. Reason: ${err}`,
    );
  }

  return res.send(card);
}

async function createCard(req, res) {
  const { name, link } = req.body;

  if (!name && !link) {
    throw new BadRequest('Не заданы параметры карточки `name` и `link`');
  }

  const isCardExists = await CardModel.exists({ name });
  if (isCardExists === true) {
    throw new BadRequest('Карточка с таким именем уже существует');
  }

  const [err, card] = await to(CardModel.create({ name, link, owner: req.user._id }));

  if (!card) {
    throw new ServerError('Ошибка при создании карточки', `Could not create card. Reason: ${err}`);
  }

  logger.debugLogger.debug(`${req.requestId} - Card with id ${card._id} has been created`);

  return res.status(201).send({ id: card._id });
}

async function deleteCard(req, res) {
  const [, card] = await to(CardModel.findById(req.params.id));

  if (!card) {
    throw new NotFound('Карточка не найдена', `Could not delete unknown card with id ${req.params.id}`);
  }

  if (String(card.owner._id) !== String(req.user._id)) {
    throw new PermissionDenied(
      'Вы можете удалить только свои карточки',
      `User [${req.user._id}] does not have right to delete card [${req.params.id}].
      Card belongs to ${card.owner._id}`,
    );
  }

  const [delErr, delResult] = await to(CardModel.deleteOne({ _id: card._id }));

  if (!delResult) {
    throw new ServerError('Ошибка при удалении карточки', `Could not delete card ${req.params.id}. ${delErr}`);
  }

  logger.debugLogger.debug(`${req.requestId} - Card with id ${req.params.id} has been deleted`);

  return res.send({ message: 'Карточка удален' });
}

async function updateCard(req, res) {
  const [, card] = await to(
    CardModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }),
  );

  if (!card) {
    throw new ServerError('Ошибка обновления карточки', `Could not update unknown card with id ${req.params.id}`);
  }

  logger.debugLogger.debug(`${req.requestId} - Card with id ${req.params.id} has been updated`);

  return res.send(card);
}

async function like(req, res) {
  const [err, card] = await to(
    CardModel.findByIdAndUpdate(
      req.params.id, { $addToSet: { likes: req.user._id } }, { new: true },
    ),
  );

  if (!card) {
    throw new ServerError('Ошибка установки лайка', `Could not set like on card ${req.params.id}, Reason: ${err}`);
  }

  logger.debugLogger.debug(`${req.requestId} - Card with id ${req.params.id} has been liked`);

  return res.send(card);
}

async function dislike(req, res) {
  const [err, card] = await to(
    CardModel.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true }),
  );

  if (!card) {
    throw new ServerError('Ошибка снятия лайка', `Could not remove like on card ${req.param.id}. Reason: ${err}`);
  }

  logger.debugLogger.debug(`${req.requestId} - Card with id ${req.params.id} has been disliked`);

  return res.send(card);
}

module.exports = {
  getAllCards, getCardById, createCard, deleteCard, updateCard, like, dislike,
};
