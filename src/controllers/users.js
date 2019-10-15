const UserModel = require('../models/user');
const logger = require('../logger');
const to = require('../utils/to');

module.exports.getAll = async (req, res) => {
  const [err, users] = await to(UserModel.find({}, '-password -tokens'));

  if (!users) {
    logger.instance.error(`Could not get users. Reason: ${err}`);
    return res.status(500).send({ message: 'Ошибка получения списка пользователей' });
  }

  return res.send(users);
};

module.exports.getById = async (req, res) => {
  const [err, user] = await to(UserModel.findById(req.params.id, '-password -tokens'));

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

  const token = await user.createToken();

  return res.status(201).send({ user, token });
};

module.exports.delete = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const [err, query] = await to(UserModel.findByIdAndRemove(req.params.id));

  if (!query) {
    logger.instance.error(`Could not delete unknown user with id ${req.param.id}`);
    return res.status(500).send({ message: 'Ошибка удаления пользователя' });
  }

  logger.instance.info(`User with id ${req.params.id} has been deleted`);
  return res.send({ message: 'Пользователь удален' });
};


module.exports.update = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const [err, user] = await to(UserModel.findByIdAndUpdate(req.params.id, req.body));

  if (!user) {
    logger.instance.error(`Could not update unknown user with id ${req.params.id}`);
    return res.status(500).send({ message: 'Ошибка обновления пользователя' });
  }

  logger.instance.info(`User with id ${req.params.id} has been updated`);
  return res.send(user);
};

module.exports.login = async (req, res) => {
  const { name, password } = req.body;
  let user = null;
  let token = null;

  try {
    user = await UserModel.loadUserByCredentials(name, password);
  } catch (e) {
    logger.instance.error(`Could not login user, ${e.toString()}`);
    return res.status(401).send({ message: 'Неизвестный пользователь' });
  }

  try {
    token = await user.createToken();
  } catch (e) {
    logger.instance.error('Could not create token');
    return res.status(500).send({ message: 'Ошибка генерации токена' });
  }

  return res.send({ user, token });
};
