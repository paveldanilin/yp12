const UserModel = require('../models/user');
const logger = require('../logger');
const to = require('../utils/to');

module.exports.getAll = async (req, res) => {
  const [err, users] = await to(UserModel.find({}));

  if (!users) {
    logger.instance.error(`Could not get users. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка получения списка пользователей' });
  }

  return res.send(users);
};

module.exports.getById = async (req, res) => {
  const [err, user] = await to(UserModel.findById(req.params.id));

  if (!user) {
    logger.instance.error(`Could not get user with id ${req.params.id}. Reason: ${err}`);
    return res.status(404).send({ message: 'Ошибка при извлечении пользователя' });
  }

  return res.send(user);
};

module.exports.create = async (req, res) => {
  const [err, user] = await to(UserModel.create(req.body));

  if (!user) {
    logger.instance.error(`Could not create user. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка при создании пользователя' });
  }

  return res.status(201).send(user);
};

module.exports.delete = async (req, res) => {
  const [err, query] = await to(UserModel.deleteOne({ _id: req.params.id }));

  if (!query) {
    logger.instance.error(`Could not delete user. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка удаления пользователя' });
  }

  if (query.deletedCount === 0) {
    logger.instance.warn(`Could not delete user with id ${req.params.id}`);
    return res.status(404).send({ message: 'Пользователь не существует' });
  }

  logger.instance.info(
    `User with id ${req.params.id} has been deleted (dc=${query.deletedCount})`,
  );

  return res.send({ message: 'Пользователь удален' });
};


module.exports.update = async (req, res) => {
  const [err, query] = await to(
    UserModel.updateOne({ _id: req.params.id }, req.body),
  );

  if (!query) {
    logger.instance.error(`Could not update user. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка обновления пользователя' });
  }

  if (query.n === 0) {
    logger.instance.warn(`Could not update user with id ${req.params.id}`);
    return res.status(404).send({ message: 'Пользователь не существует' });
  }

  if (query.nModified === 0) {
    logger.instance.warn(`Nothing to update at user id ${req.params.id}`);
    return res.status(304).send();
  }

  logger.instance.info(
    `User with id ${req.params.id} has been updated (nm=${query.nModified})`,
  );

  return res.send({ message: 'Пользователь обновлен' });
};
